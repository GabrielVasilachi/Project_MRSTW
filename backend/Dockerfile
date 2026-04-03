FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder
WORKDIR /app

COPY MRSTW.Api/MRSTW.Api.csproj MRSTW.Api/
COPY MRSTW.DataAccessLayer/MRSTW.DataAccessLayer.csproj MRSTW.DataAccessLayer/
COPY MRSTW.BusinessLayer/MRSTW.BusinessLayer.csproj MRSTW.BusinessLayer/
COPY MRSTW.Domain/MRSTW.Domain.csproj MRSTW.Domain/

RUN dotnet restore MRSTW.Api/MRSTW.Api.csproj

COPY . .

RUN dotnet publish MRSTW.Api/MRSTW.Api.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=builder /app/out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "MRSTW.Api.dll"]
