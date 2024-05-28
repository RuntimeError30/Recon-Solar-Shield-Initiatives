namespace RSSI_webAPI.Models;

public class GeoMagnetDataModel
{
    public DateTime Time { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }

    // Field values
    public double Intensity { get; set; }
    public double Declination { get; set; }
    public double Inclination { get; set; }
    public double North { get; set; }
    public double East { get; set; }
    public double Vertical { get; set; }
    public double Horizontal { get; set; }

}
