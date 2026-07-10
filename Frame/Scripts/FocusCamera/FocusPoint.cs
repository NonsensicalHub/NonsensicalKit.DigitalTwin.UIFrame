using NonsensicalKit.Core;
using UnityEngine;

public class FocusPoint : MonoBehaviour
{
    [SerializeField] private string m_id;
    [SerializeField] private GameObject m_point;

    [SerializeField] private bool m_autoInit = true;

    private void Reset()
    {
        m_point ??= this.gameObject;
    }

    private void Awake()
    {
        if (m_autoInit)
        {
            IOCC.Subscribe(" ", m_id, FocusEquipment);
        }
    }

    public void SetID(string id)
    {
        m_id = id;
        IOCC.Subscribe("focusEquipment", m_id, FocusEquipment);
    }


    private void FocusEquipment()
    {
        IOCC.Get<ConfigurableCamera>("FocusCamera").StartFocus(transform);
    }
    
}
