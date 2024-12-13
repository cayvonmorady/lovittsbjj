# Stop.ps1
Write-Output "Stopping the Docker container..."
docker stop my-website-container

Write-Output "Removing the Docker container..."
docker rm my-website-container

Write-Output "Container stopped and removed."