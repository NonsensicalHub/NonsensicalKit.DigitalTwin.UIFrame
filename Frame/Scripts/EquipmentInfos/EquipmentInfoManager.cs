using System.Collections.Generic;
using NonsensicalKit.Core;
using NonsensicalKit.Core.DagLogicNode;
using NonsensicalKit.Tools;
using TMPro;
using UnityEngine;

/// <summary>
///设备状态信息管理类
/// 用于接收网络部分初步处理号的设备数据,并转发给UI作为显示
/// 包括信息显示与报警显示 消息订阅 
/// </summary>
namespace Frame.Equipment
{
    public class EquipmentInfoManager : NonsensicalMono
    {
        [SerializeField] private TMP_Text _Title;
        [SerializeField] private RectTransform _rectTransform;
        [SerializeField] private GameObject m_prefab_equipmentDetailsElement;
        [SerializeField] private List<EquipmentDetailsElement> _eElements = new();


        Dictionary<string, List<EquipmentDetailsElement>> _elements = new();
        Dictionary<string, string> _equipmentTypeToName = new();


        private void Awake()
        {
            Subscribe<string>("showEquipment", ShowEquipment);
            Subscribe((int)DagLogicNodeEnum.NodeExit, "设备管理", OnExit);
        }

        public void Init(List<IconConfig> list)
        {
            foreach (var config in list)
            {
                var iconCount = config.CustomID ? config.CustomIDStrings.Length : config.Count;
                for (var i = 0; i <iconCount; i++)
                {
                    var obj = Instantiate(m_prefab_equipmentDetailsElement, m_prefab_equipmentDetailsElement.transform.parent);
                    obj.SetActive(true);
                    var element = obj.GetComponent<EquipmentDetailsElement>();
                    _eElements.Add(element);

                    element.Init(config.GetSprite(), config.CustomID ? config.CustomIDStrings[i] : config.PrefixID + i, config.Type, config.Name);
                    _elements.ListAdd(config.Type, element);
                    obj.SetActive(false);
                }

                _equipmentTypeToName.Add(config.Type, config.Name);
            }
        }

        private void OnEnable()
        {
            _Title.text = "";
            SetElementActive(string.Empty);
        }

        private void OnExit()
        {
        }

        private void ShowEquipment(string type)
        {
            _Title.text = _equipmentTypeToName[type];

            SetElementActive(type);
        }

        private void SetElementActive(string etype)
        {
            foreach (var item in _eElements)
            {
                item.gameObject.SetActive(item.m_EquipmentType == etype);

                if (item.m_EquipmentType == etype)
                {
                    //todo:信息生成
                    var dic = new Dictionary<string, string>()
                    {
                        ["DeviceCode"] = item.DeviceCode,
                        ["DeviceName"] = item.DeviceName
                    }; //必须包含

                    var info = Execute<Dictionary<string, string>, ( SimpleInfo, Dictionary<string, string>)>("GetEquipmentInfo", dic);

                    if (info.Item2.TryGetValue("DeviceCode", out var deviceCode) == false)
                    {
                        Debug.LogError("设备信息缺少关键项: DeviceCode");
                        continue;
                    }

                    item.RefreshStatus(info);
                }

                _rectTransform.offsetMax += new Vector2(0.1f, 0.1f);
                NonsensicalInstance.Instance.DelayDoIt(0f, () => { _rectTransform.offsetMax += new Vector2(-0.1f, -0.1f); });
            }
        }
    }

    public class SimpleInfo
    {
        public KeyValuePair<string, string> Quest;
        public KeyValuePair<string, string> CompletionStatus;
        public Color Color;
        public int Status;
    }
}
