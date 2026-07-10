using NonsensicalKit.Core;
using NonsensicalKit.Core.DagLogicNode;
using NonsensicalKit.Core.Log;
using NonsensicalKit.Core.Service;
using NonsensicalKit.Tools;
using NonsensicalKit.UGUI;
using UnityEngine;
using UnityEngine.UI;

[RequireComponent(typeof(FollowGameObject))]
public class JKPhysicalSpaceUIPoint : NonsensicalUI, IDigitalTwinUI
{
    [SerializeField] private GameObject m_controlPart;
    [SerializeField] private Button m_btn;

    private FollowGameObject _follow;
    private string[] _showNodes;
    private string _id;
    private string _targetNode;
    private UIPoint _uiPoints;


    protected override void Awake()
    {
        base.Awake();

        _follow = GetComponent<FollowGameObject>();

        Subscribe<DagRuntimeNode>((int)DagLogicNodeEnum.SwitchNode, OnChangedNode);
        if (m_btn != null)
        {
            m_btn.onClick.AddListener(OnButtonClick);
        }

    }


    private void Update()
    {
        m_controlPart.gameObject.SetActive(!_follow.Back);
    }

    public void Init(GameObject point, string id)
    {
        _follow.SetTarget(point);
        _id = id;
        IOCC.AddListener<UIPoint>("registerUIPoint", RegisterUIPoint);
    }

    private void RegisterUIPoint(UIPoint uiPoints)
    {
        if (uiPoints.m_IconID != _id) return;
        _uiPoints = uiPoints;
        //获取配置信息
        if (uiPoints != null)
        {
            _showNodes = uiPoints.m_ShowNodes;
            ServiceCore.SafeGet<DagLogicManager>(OnGetService);
        }
        else
        {
            LogCore.Warning($"未找到id为{_id}的UI配置");
        }
    }

    private void OnButtonClick()
    {
        _uiPoints?.OnClick();
    }
    
    private void OnGetService(DagLogicManager logic)
    {
        OnChangedNode(logic.CrtSelectNode);
    }

    private void OnChangedNode(DagRuntimeNode node)
    {
        if (_showNodes == null) return;
        if (_showNodes.Contains(node.NodeID))
        {
            gameObject.SetActive(true);
            OpenSelf(true);
        }
        else
        {
            gameObject.SetActive(false);
            CloseSelf(false);
        }
    }

    protected override void OnOpen()
    {
        CanvasGroup.blocksRaycasts = true;
        CanvasGroup.DoFade(0.5f, 0.2f);
    }
}
