using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EquipmentElementIconManager : MonoBehaviour
{
    [SerializeField] private GameObject _iconPrefab;
    [SerializeField] private EquipmentElementIconConfig _config;
    [SerializeField] private Frame.Equipment.EquipmentInfoManager _equipmentInfoManager;

    private void Awake()
    {
        if (_equipmentInfoManager == null)
        {
            _equipmentInfoManager = GameObject.FindFirstObjectByType<Frame.Equipment.EquipmentInfoManager>();
        }

        foreach (var icon in _config.data.Icons)
        {
            var go = Instantiate(_iconPrefab.gameObject, _iconPrefab.transform.parent);
            go.SetActive(true);
            var iconUI = go.GetComponent<Frame.Equipment.EquipmentElement>();
            iconUI.Init(icon.Name, icon.Sprite, icon.Type);
        }

        if (_equipmentInfoManager == null)
        {
            Debug.LogError(" 未找到设备信息管理器,将无法生成设备详细信息Element ");
            
            return;
        }

        _equipmentInfoManager.Init(_config.data.Icons);
    }
}
