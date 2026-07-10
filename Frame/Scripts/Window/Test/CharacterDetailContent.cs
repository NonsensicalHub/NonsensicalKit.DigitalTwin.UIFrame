using UnityEngine;
using UnityEngine.UI;
using TMPro;

/// <summary>
/// 示例：角色详情内容，可被加载到 WindowContainer 中
/// </summary>
public class CharacterDetailContent : MonoBehaviour, IWindowContent
{
    [SerializeField] private TextMeshProUGUI _nameLabel;
    [SerializeField] private Image           _avatarImage;
    [SerializeField] private TextMeshProUGUI _descLabel;

    /// <summary>
    /// 外部传入的参数类型
    /// </summary>
    public class CharacterArgs
    {
        public string CharacterName;
        public Sprite Avatar;
        public string Description;
    }

    // ============ IWindowContent 实现 ============

    public void OnContentInit(object args)
    {
        if (args is CharacterArgs data)
        {
            _nameLabel.text   = data.CharacterName;
            _avatarImage.sprite = data.Avatar;
            _descLabel.text   = data.Description;
        }
    }

    public bool OnContentClose()
    {
        // 在此处做清理：保存数据、释放资源、确认弹窗等
        Debug.Log("[CharacterDetailContent] 正在关闭，执行清理逻辑...");
        return true; // 返回 true 允许关闭
    }
}
