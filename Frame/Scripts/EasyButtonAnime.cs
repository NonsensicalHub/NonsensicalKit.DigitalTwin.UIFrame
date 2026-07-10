using System;
using NonsensicalKit.Core;
using NonsensicalKit.Tools;
using UnityEngine;

public class EasyButtonAnime : MonoBehaviour
{
    [SerializeField] private Transform m_controlTarget;
    [SerializeField] private float m_time = 0.5f;

    private Vector3 _endPos;
    private Vector3 _startPos;

    private void Awake()
    {
        _endPos = m_controlTarget.localPosition;
    }

    private void OnEnable()
    {
        NonsensicalInstance.Instance.DelayDoIt(0, () =>
        {
            var rect = transform.parent.GetComponent<RectTransform>();
            _startPos = GetGeometricCenter(rect);
            m_controlTarget.position = _startPos;
            m_controlTarget.DoLocalMove(_endPos, m_time);
        });
    }

    private void OnDisable()
    {
        m_controlTarget.position = _startPos;
    }
    
    public static Vector3 GetGeometricCenter(RectTransform rectTransform)
    {
        Vector3[] corners = new Vector3[4];
        rectTransform.GetWorldCorners(corners);

        return (corners[0] + corners[2]) * 0.5f;
    }
}
