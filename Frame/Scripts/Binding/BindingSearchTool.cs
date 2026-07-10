using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using UnityEngine;

public class BindingSearchTool : BindingToken
{
    [SerializeField] private SearchTool m_searchTool;

    public override void BindToken(JToken token)
    {
        if (m_searchTool == null)
        {
            LogWarning($"{name} 缺少 SearchTool，无法绑定");
            return;
        }

        if (token == null || token.Type != JTokenType.Array)
        {
            LogWarning($"{name} SearchTool 绑定数据应为数组");
            return;
        }

        var infos = new List<SearchInfo>();
        foreach (var item in token)
        {
            if (item == null || item.Type != JTokenType.Object)
            {
                continue;
            }

            var obj = (JObject)item;
            var text = obj["Text"]?.ToString();
            if (string.IsNullOrEmpty(text))
            {
                continue;
            }

            var type = SearchType.String;
            var typeToken = obj["Type"];
            if (typeToken != null)
            {
                if (typeToken.Type == JTokenType.Integer)
                {
                    type = (SearchType)typeToken.Value<int>();
                }
                else if (typeToken.Type == JTokenType.String)
                {
                    var typeStr = typeToken.ToString();
                    if (int.TryParse(typeStr, out var intType))
                    {
                        type = (SearchType)intType;
                    }
                    else if (System.Enum.TryParse(typeStr, true, out SearchType enumType))
                    {
                        type = enumType;
                    }
                }
            }

            infos.Add(new SearchInfo
            {
                Text = text,
                Type = type
            });
        }

        m_searchTool.SetSearchTypeInfos(infos);
    }

    public override JToken CollectJson()
    {
        return null;
    }
}
