using System;
using NonsensicalKit.Core;
using NonsensicalKit.Core.Service;
using UnityEngine;

public class SelfTimer : MonoBehaviour, IMonoService
{
    private TimerSystem timeSys;

    private void Awake()
    {
        IsReady = false;
        
        timeSys = TimerSystem.Instance;
        timeSys.Init();
        timeSys.StartTimer();

        IOCC.Set<TimerSystem>("Timer", timeSys);

        IsReady = true;
        InitCompleted?.Invoke();
    }

    private void OnDestroy()
    {
        timeSys?.ResetTimer();
    }

    public bool IsReady { get; private set; }
    public Action InitCompleted { get; set; }
}
