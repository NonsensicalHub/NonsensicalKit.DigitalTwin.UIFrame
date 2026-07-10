using System;
using Newtonsoft.Json.Linq;
using UnityEngine;

public class BindingSliderInputField : BindingToken
{
    [SerializeField] private SliderInputField m_sliderInputField;

    public override void BindToken(JToken token)
    {
        if (m_sliderInputField is null) return;
        if (token.Type == JTokenType.Object)
        {
            if (token is JObject obj)
            {
                if (obj.TryGetValue("绑定信号", out var signal))
                {
                    m_sliderInputField.SignalID = signal.Value<string>();
                }

                if (obj.TryGetValue("货架切片数量", out var value))
                {
                    m_sliderInputField.SetRange(1, value.Value<int>());
                    m_sliderInputField.DefaultValue= value.Value<int>();
                }
            }
        }
    }
    
    public override JToken CollectJson()
    {
        throw new NotImplementedException();
    }
}
