namespace RSSI_webAPI.Models.DtoModels;

public class SatelliteDataDtoModel
{
    public DateTime Time { get; set; }
    public double Bt { get; set; }
    public double BxGSM { get; set; }
    public double ByGSM { get; set; }
    public double BzGSM { get; set; }
}
