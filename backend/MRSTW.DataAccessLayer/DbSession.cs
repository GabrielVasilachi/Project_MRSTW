namespace MRSTW.DataAccessLayer;

public static class DbSession
{
    public static string ConnectionString =>
        Environment.GetEnvironmentVariable("CONNECTION_DEFAULT") ?? throw new InvalidOperationException("CONNECTION_DEFAULT is not set.");
}