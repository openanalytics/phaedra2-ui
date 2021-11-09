kubectl port-forward -n phaedra2 "service/phaedra-plate-service" 6010:8080 &
kubectl port-forward -n phaedra2 "service/phaedra-metadata-service" 6020:8080 &
kubectl port-forward -n phaedra2 "service/phaedra-protocol-service" 6030:8080 &
kubectl port-forward -n phaedra2 "service/phaedra-calculation-service" 6040:8080 &
kubectl port-forward -n phaedra2 "service/phaedra-resultdata-service" 6050:8080 &
kubectl port-forward -n phaedra2 "service/phaedra-measurement-service" 6060:8080 &

npm run serve &
