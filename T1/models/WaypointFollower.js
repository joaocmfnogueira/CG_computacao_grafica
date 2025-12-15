import * as THREE from 'three';

export class WaypointFollower {
    constructor(mesh, waypoints, speed = 20, turnSpeed = 2) {
        this.mesh = mesh;               
        this.speed = speed;             
        this.baseSpeed = speed;         
        this.turnSpeed = turnSpeed;     
        this.current = 0;               
        this.threshold = 15;            

        // Cria caminhos únicos com offset para cada bot
        const MAX_OFFSET = 3; 
        this.waypoints = waypoints.map(point => {
            const offsetX = (Math.random() - 0.5) * 2 * MAX_OFFSET;
            const offsetZ = (Math.random() - 0.5) * 2 * MAX_OFFSET;
            return new THREE.Vector3(point.x + offsetX, point.y, point.z + offsetZ);
        });
    }

    update(dt) {
        if (this.waypoints.length === 0) return;

        const target = this.waypoints[this.current];

        // Lógica de Direção e Rotação
        const direction = new THREE.Vector3().subVectors(target, this.mesh.position).normalize();
        const forward = new THREE.Vector3(-1, 0, 0).applyQuaternion(this.mesh.quaternion);

        const dirFlat = new THREE.Vector3(-direction.x, 0, direction.z).normalize();
        const fwdFlat = new THREE.Vector3(-forward.x, 0, forward.z).normalize();

        const desiredAngle = Math.atan2(dirFlat.z, dirFlat.x);
        const currentAngle = Math.atan2(fwdFlat.z, fwdFlat.x);

        let delta = desiredAngle - currentAngle;
        delta = Math.atan2(Math.sin(delta), Math.cos(delta)); 

        this.mesh.rotation.y += delta * this.turnSpeed * dt;
        this.mesh.translateX(-this.speed * dt);

        // Checagem de Distância (Troca de Waypoint)
        const distSq = (this.mesh.position.x - target.x) ** 2 + (this.mesh.position.z - target.z) ** 2;
        const thresholdSq = this.threshold * this.threshold;

        if (distSq < thresholdSq) {
            // Lógica de Volta Completa
            const nextIndex = this.current + 1;
            
            if (nextIndex >= this.waypoints.length) {
                this.current = 0; // Reinicia a volta
                
                // RECARREGAR MUNIÇÃO DO BOT (Igual ao Player)
                if (this.mesh.userData) {
                    this.mesh.userData.nBullets = 4;
                    // console.log("Bot recarregou munição!"); 
                }
            } else {
                this.current = nextIndex;
            }
        }
    }
}