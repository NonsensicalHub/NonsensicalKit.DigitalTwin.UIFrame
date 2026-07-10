using NonsensicalKit.Core.Service;
using UnityEngine;

public class DigitalTwinUIPoint : MonoBehaviour
{
    [SerializeField] private string m_Type;
    [SerializeField] private string m_ID;
    [SerializeField] private bool autoSetID;

    private void Start()
    {
        ServiceCore.SafeGet<DigitalTwinUIManager>(OnGetConfig);
    }

    private void OnGetConfig(DigitalTwinUIManager manager)
    {
        DigitalTwinUIManager UIManager = manager as DigitalTwinUIManager;
        UIManager.Register(new DigitalTwinUIInfo(gameObject, m_Type, m_ID));
    }

    void OnValidate()
    {
        if (autoSetID)
            m_ID = this.name;
    }
}

public class DigitalTwinUIInfo
{
    public GameObject Point;
    public string Type;
    public string ID;

    public DigitalTwinUIInfo(GameObject point, string type, string iD)
    {
        Point = point;
        Type = type;
        ID = iD;
    }
}
