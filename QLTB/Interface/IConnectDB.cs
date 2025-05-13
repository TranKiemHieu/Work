using Domain;
using Microsoft.Data.SqlClient;

namespace QLTB.Interface
{
    public interface IConnectDB
    {
        SqlConnection IConnectData();
    }
}
