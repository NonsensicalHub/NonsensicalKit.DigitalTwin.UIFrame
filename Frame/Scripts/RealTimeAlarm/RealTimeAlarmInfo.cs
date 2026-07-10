namespace Frame.RealTimeAlarm
{
    public class RealTimeAlarmInfo
    {
        /// <summary>
        /// 报警时间
        /// </summary>
        public string Timestamp;

        /// <summary>
        /// 处理时间
        /// </summary>
        public string ProcessDateTime;

        /// <summary>
        /// 解决时间
        /// </summary>
        public string ResolutionDateTime;

        /// <summary>
        /// 报警设备/位置/名称
        /// </summary>
        public string AlarmDevice;

        /// <summary>
        /// 报警简讯信息/代码
        /// </summary>
        public string AlarmType;

        /// <summary>
        /// 报警详细信息
        /// </summary>
        public string AlarmDescription;

        /// <summary>
        /// 处理状态
        /// </summary>
        public int Status;

        /// <summary>
        /// 报警设备ID
        /// </summary>
        public string DeviceID;
    }
}
