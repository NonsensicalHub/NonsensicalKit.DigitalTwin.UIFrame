using System;
using System.Collections.Generic;
using BJTimer;
using NonsensicalKit.Core;
using UnityEngine;
using Random = UnityEngine.Random;

namespace Frame.RealTimeAlarm
{
    public class RealTimeAlarmSimulationDataGenerator : NonsensicalMono
    {
        [SerializeField] private int m_maxDataCount = 15;
        [SerializeField] private int m_requestInterval = 10;


        private List<Frame.RealTimeAlarm.RealTimeAlarmInfo> _datas = new();

        private readonly List<List<string>> _alarmList = new();
        private IDPack _timerID;
        private List<string> _alarmTitleList;

        private void Start()
        {
            _timerID = IOCC.Get<TimerSystem>("Timer").AddTimerTask(CreateData, m_requestInterval, 0, TimeUnit.Secound, true);
            AddHandler<RealTimeAlarmInfo, List<(string, string)>>("getSolution", GetSolution);
            AddHandler<int, List<(string, string)>>("getSolutionByInt", GetSolution);
            AddHandler<int, int, (List<List<string>>, int)>("getAlarmList", GetAlarmData);

            _alarmTitleList = new List<string>()
            {
                "报警时间",
                "处理时间",
                "故障代码",
                "故障简述",
                "故障位置",
                "状态"
            };
        }

        private void CreateData(int _)
        {
            RealTimeAlarmInfo temp = new();
            temp.Timestamp = DateTime.Now.ToString();
            temp.ProcessDateTime = DateTime.Now.ToString();
            temp.ResolutionDateTime = DateTime.Now.ToString();
            temp.AlarmDevice = "设备名称";
            // temp._Status =/* item.warningState*/2; //强制设备正常状态
            temp.Status = Random.Range(0, 3);
            temp.AlarmDescription = "报警详情";
            temp.AlarmType = "报警简讯";
            temp.DeviceID = "AB" + Random.Range(100, 1000).ToString();

            if (_datas.Count > m_maxDataCount)
            {
                _datas.RemoveAt(0);
            }

            _datas.Add(temp);
            Publish<List<Frame.RealTimeAlarm.RealTimeAlarmInfo>>("refreshRealTimeAlarmTable", _datas);
        }

        private List<(string, string)> GetSolution(RealTimeAlarmInfo alarmCode)
        {
            //根据报警信息查询解决方案
            return new List<(string, string)>()
            {
                ("报警设备:", $"{alarmCode.AlarmDevice}_{alarmCode.DeviceID}"),
                ("故障代码:", alarmCode.AlarmType),
                ("故障详情:", alarmCode.AlarmDescription),
                ("解决方案:", "依据故障信息查询出的解决方法")
            };
        }
        
        /// <summary>
        /// 包报警记录中发出指令需要展示报警详情的解决方案
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        private List<(string, string)> GetSolution(int index)
        {
            //从获取到的报警信息进行解析,得出报警详情及其解决方案
            return new List<(string, string)>()
            {
                ("报警设备:", $"设备名称_{"AB" + Random.Range(100, 1000)}"),
                ("故障代码:", "报警简讯"),
                ("故障详情:", "报警详情"),
                ("解决方案:", "依据故障信息查询出的解决方法")
            };
        }

        // 模拟数据服务：获取分页报警数据
        private (List<List<string>>, int) GetAlarmData(int page, int pageSize)
        {
            // 模拟生成数据（实际项目中应从数据库或API获取）
            _alarmList.Clear();
            _alarmList.Add(_alarmTitleList);
            var totalCount = 100; // 假设总记录数为100

            int startIndex = (page - 1) * pageSize;
            for (int i = startIndex; i < startIndex + pageSize && i < totalCount; i++)
            {
                _alarmList.Add(new List<string>
                {
                    DateTime.Now.AddDays(-i).ToString("MM月dd日 HH:mm:ss"),
                    DateTime.Now.AddDays(-i).AddHours(1).ToString("MM月dd日 HH:mm:ss"),
                    $"ERR{i:D4}",
                    $"模拟故障描述 {i}",
                    $"位置 {i % 10 + 1}",
                    i % 2 == 0 ? "已处理" : "未处理"
                });
            }

            return (_alarmList, totalCount);
        }
    }
}
