
namespace RSSI_webAPI.Models;

public class SupervisedDataModel
{
    [System.ComponentModel.DataAnnotations.Key]
    public int Id { get; set; }
    
    // Time
    public int Year { get; set; }
    public int Month { get; set; }
    // Satellite
    [System.ComponentModel.DataAnnotations.Required]
    public float BxGSM { get; set; }

    [System.ComponentModel.DataAnnotations.Required]
    public float ByGSM { get; set; }

    [System.ComponentModel.DataAnnotations.Required]
    public float BzGSM { get; set; }
    // Target
    public float Bt { get; set; }
    // Geo-magnetism
    public float Intensity { get; set; }
    public float Declination { get; set; }
    public float Inclination { get; set; }
    public float North { get; set; }
    public float East { get; set; }
    public float Vertical { get; set; }
    public float Horizontal { get; set; }
}
