# Start.ps1
Write-Output "Building the Docker image..."
docker build -t my-website .

Write-Output "Starting the Docker container..."
docker run -d -p 8080:80 --name my-website-container my-website

Write-Output "Website is running at http://localhost:8080"