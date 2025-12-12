import * as THREE from 'three';

export class WaypointFollower {
    constructor(mesh, waypoints, speed = 20, turnSpeed = 2) {
        this.mesh = mesh;               // objeto 3D do bot
        this.waypoints = waypoints;     // lista de Vector3
        this.speed = speed;             // velocidade linear
        this.turnSpeed = turnSpeed;     // velocidade de rotação
        this.current = 0;               // índice atual
        this.threshold = 15;             // distancia para trocar waypoint
    }

    update(dt) {
        if (this.waypoints.length === 0) return;

        const target = this.waypoints[this.current];
        // console.log(target);

        // console.log(target);

        // Direção do veículo até o waypoint
        const direction = new THREE.Vector3()
            .subVectors(target, this.mesh.position)
            .normalize();

        // Direção atual do veículo (vetor para frente)
        const forward = new THREE.Vector3(-1,0,0)
            .applyQuaternion(this.mesh.quaternion);

        // Ângulo entre onde ele está indo e onde deveria ir
        const angle = forward.angleTo(direction);

        // Eixo de rotação (sempre perpendicular ao plano)
        const dirFlat = new THREE.Vector3(-direction.x, 0, direction.z).normalize();
        const fwdFlat = new THREE.Vector3(-forward.x, 0, forward.z).normalize();

        const desiredAngle = Math.atan2(dirFlat.z, dirFlat.x);
        const currentAngle = Math.atan2(fwdFlat.z, fwdFlat.x);

        let delta = desiredAngle - currentAngle;
        delta = Math.atan2(Math.sin(delta), Math.cos(delta)); // normalizar [-PI, PI]

        this.mesh.rotation.y += delta * this.turnSpeed * dt;

        // Movimentação para frente
        this.mesh.translateX(-this.speed * dt);

        // Distância até o waypoint
        const distance = this.mesh.position.distanceTo(target);

        // Se chegou perto o suficiente, passa pro próximo
        if (distance < this.threshold) {
            this.current = (this.current + 1) % this.waypoints.length;
        }
    }
}
