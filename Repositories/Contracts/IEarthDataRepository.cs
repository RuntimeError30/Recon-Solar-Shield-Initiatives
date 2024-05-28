using RSSI_webAPI.Models;

namespace RSSI_webAPI.Repositories.Contracts;

public interface IEarthDataRepository
{
    Task<GeoMagnetDataModel?> GetGeoMagneticDataFromBGS();
    Task<GeoMagnetDataModel?> GetGeoMagneticDataFromNCEI();
}
