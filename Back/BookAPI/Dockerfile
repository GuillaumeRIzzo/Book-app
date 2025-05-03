# Use .NET SDK as the base image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory inside the container
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY BookAPI.csproj ./
RUN dotnet restore "./BookAPI.csproj"

# Copy the rest of the source code
COPY . .

# Build the project
RUN dotnet build "BookAPI.csproj" -c Release -o /app/build

# Publish the project
RUN dotnet publish "BookAPI.csproj" -c Release -o /app/publish

# Use the runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set the working directory
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Set the entry point for the container
ENTRYPOINT ["dotnet", "BookAPI.dll"]
