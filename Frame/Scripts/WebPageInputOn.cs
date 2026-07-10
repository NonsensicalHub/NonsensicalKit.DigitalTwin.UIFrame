using System;
using UnityEngine;

public class WebPageInputOn : MonoBehaviour
{
    private void OnEnable()
    {
        WebInputDeviceSend.Instance.Create("127.0.0.1","9595");
    }

    private void OnDisable()
    {
        WebInputDeviceSend.Instance.Stop();
    }
}
