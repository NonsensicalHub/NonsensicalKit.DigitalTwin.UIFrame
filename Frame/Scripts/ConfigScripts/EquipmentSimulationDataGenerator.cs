using System;
using System.Collections.Generic;
using System.Linq;
using Frame.Equipment;
using NonsensicalKit.Core;
using UnityEngine;
using Random = UnityEngine.Random;

public class EquipmentSimulationDataGenerator : NonsensicalMono
{
    private void Awake()
    {
        AddHandler<Dictionary<string, string>, ( SimpleInfo, Dictionary<string, string>)>("GetEquipmentInfo", CreateInfo);
    }

    private (SimpleInfo, Dictionary<string, string>) CreateInfo(Dictionary<string, string> baseInfo)
    {
        int code = (Random.Range(0, 10) % 2);
        var baseDic = new SimpleInfo
        {
            Quest = new("任务信息", "XXXXXXXXX"),
            CompletionStatus = new("完成情况", code switch { 0 => "已完成", 1 => "故障", _ => "进行中" }),
            Color = code switch { 0 => Color.green, 1 => Color.red, _ => Color.yellow },
            Status = code
        };

        var dic = new Dictionary<string, string>
        {
            { "DeviceCode", baseInfo["DeviceCode"] },
            { "名称", baseInfo["DeviceName"] },
            { "运行状态", code == 0 ? "可用" : "不可用" },
            { "当前位置", "XXXXXX" },
            { "当前执行任务", "XXXXXXXXX" },
            { "故障详情", "XXXXXX" }
        };

        return (baseDic, dic);
    }
}
