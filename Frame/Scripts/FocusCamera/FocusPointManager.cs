using System;
using System.Linq;
using NaughtyAttributes;
using NonsensicalKit.Core;
using NonsensicalKit.Core.DagLogicNode;
using NonsensicalKit.Tools;
using UnityEngine;

/// <summary>
/// 注视焦点管理
/// </summary>
public class FocusPointManager : NonsensicalMono
{
    [SerializeField] private bool m_autoExit;
    [SerializeField, ShowIf("m_autoExit")] private string m_exitNodeName;
    [SerializeField] private FocusPointConfig[] m_points;
    [SerializeField] private ConfigurableCamera m_camera;

    private bool _hasFocus = false;

    [Button("计算数据")]
    private void CalculationParameters()
    {
        foreach (var point in m_points)
        {
            point.CalculationCenter();
        }
    }

    private void Awake()
    {
        if (m_autoExit)
        {
            Subscribe<DagNode>((int)DagLogicNodeEnum.SwitchNode, AutoExit);
        }

        Subscribe<string>("focusEquipment", FocusEquipment);
        Subscribe("ExitFocus", ExitFocus);
        if (m_camera == null)
        {
            m_camera = Resources.Load<GameObject>("Services/注视相机").GetComponentInChildren<ConfigurableCamera>(true);
            if (m_camera == null)
            {
                Debug.LogError("未能加载注视相机!");
                return;
            }

            m_camera.gameObject.SetActive(false);
        }

        CalculationParameters();
    }


    private void FocusEquipment(string id)
    {
        var temp = m_points.FirstOrDefault(x => x.m_ID == id);
        if (temp == null) return;
        _hasFocus = true;
        m_camera?.gameObject.SetActive(true);
        m_camera?.StartFocus(temp.m_FocusCenter, temp.m_FocusDistance);
    }

    private void AutoExit(DagNode logicNode)
    {
        if (logicNode.nodeId == m_exitNodeName)
        {
            return;
        }

        m_camera?.gameObject.SetActive(false);
        _hasFocus = false;
    }

    private void ExitFocus()
    {
        if (!_hasFocus) return;
        m_camera?.gameObject.SetActive(false);
        _hasFocus = false;
    }
}

[Serializable]
public class FocusPointConfig
{
    public string m_ID;
    public bool m_NeedCalculationCenter;
    public Transform[] m_FocusPoints;
    public Vector3 m_Offset;
    [HideInInspector] public Transform m_FocusCenter;
    [HideInInspector] public float m_FocusDistance = -1f;
    [HideInInspector] public Bounds m_Bounds;

    public void CalculationCenter()
    {
        if (m_FocusPoints is { Length: > 0 } == false) return;

        m_Bounds = new Bounds();
        foreach (var child in m_FocusPoints)
        {
            m_Bounds.Encapsulate(child.BoundingBox());
        }

        if (m_NeedCalculationCenter)
        {
            if (Camera.main != null)
            {
                float fov = Camera.main.fieldOfView * Mathf.Deg2Rad;
                if (Screen.width < Screen.height)
                {
                    fov = Camera.VerticalToHorizontalFieldOfView(fov, Camera.main.aspect);
                }

                float diagonal = Mathf.Sqrt(m_Bounds.size.x * m_Bounds.size.x + m_Bounds.size.y * m_Bounds.size.y + m_Bounds.size.z * m_Bounds.size.z);

                m_FocusDistance = (0.6f * diagonal) / Mathf.Tan(fov * 0.5f);
            }

            var np = new GameObject("CalculationCenter")
            {
                transform =
                {
                    position = m_Bounds.center + m_Offset
                }
            };
            np.transform.SetParent(m_FocusPoints[0], false);
            m_FocusCenter = np.transform;
        }
        else
        {
            m_FocusCenter = m_FocusPoints[0];
        }
    }
}
