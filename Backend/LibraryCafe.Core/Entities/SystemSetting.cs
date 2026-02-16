using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("systemsettings")]
    public class SystemSetting
    {
        [Column("settingid")]
        public int Id { get; set; }

        [Column("settingname")]
        public string SettingName { get; set; } = null!;

        [Column("settingvalue")]
        public string SettingValue { get; set; } = null!;
    }
}