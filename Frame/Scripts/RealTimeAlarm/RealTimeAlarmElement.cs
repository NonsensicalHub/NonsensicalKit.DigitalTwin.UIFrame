using NonsensicalKit.UGUI.Table;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace Frame.RealTimeAlarm
{
    public class RealTimeAlarmElement : ListTableElement<RealTimeAlarmInfo>, IPointerClickHandler
    {
        [SerializeField] private TMP_Text date;
        [SerializeField] private TMP_Text _info;
        [SerializeField] private GameObject _Status_OK;
        [SerializeField] private GameObject _Status_Error;
        [SerializeField] private Image _bg;
        [SerializeField] private Sprite[] _sp;

        public override void SetValue(RealTimeAlarmInfo elementData)
        {
            base.SetValue(elementData);
            if (elementData != null)
            {
                date.text = elementData.Timestamp;
                bool a = elementData.Status == 2;
                _bg.sprite = a ? _sp[0] : _sp[1];
                _Status_OK.SetActive(a);
                _Status_Error.SetActive(!a);
                _info.text = $"报警位置: {elementData.AlarmDevice}\n报警描述: {elementData.AlarmType}\n状态: {elementData.Status switch { 0 => "未处理", 1 => "处理中", 2 => "处理完成", _ => "" }} ";

            }
        }
        public void OnPointerClick(PointerEventData eventData)
        {
            Publish("showRealTimeAlarmDetail", ElementData);
        }

    }
}