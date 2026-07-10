using NonsensicalKit.Core;
using UnityEngine;
using UnityEngine.Events;

public class UIPoint : MonoBehaviour
{
    [BindableParam("IconID")] public string m_IconID;
    [BindableParam("ShowNode")] public string[] m_ShowNodes;

    public UnityEvent m_OnClick;

    private void Start()
    {
        IOCC.Set("registerUIPoint", this);
    }

    public void OnClick()
    {
        m_OnClick?.Invoke();
    }
}
