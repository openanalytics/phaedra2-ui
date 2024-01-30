ENV_FILE=.env.local

ACCESS_TOKEN=$(curl --location --request POST 'https://keycloak.phaedra.poc.openanalytics.io/auth/realms/phaedra2/protocol/openid-connect/token' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=phaedra2-dev-api' --data-urlencode 'client_secret=4ECaLroP2ALXvvg7VA4AEa95Ca4XbHvA' --data-urlencode 'scope=email' --data-urlencode 'grant_type=client_credentials' | jq -r '.access_token')

sed -i '' -e "s/^VUE_APP_API_BEARER_TOKEN=.*/VUE_APP_API_BEARER_TOKEN=$ACCESS_TOKEN/g" "$ENV_FILE"

kubectl.docker port-forward -n phaedra2 "service/phaedra-gateway" 8081:8080 &
npm run serve
