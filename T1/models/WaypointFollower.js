import * as THREE from 'three';

export class WaypointFollower {
    constructor(mesh, waypoints, speed = 10, turnSpeed = 2) {
        this.mesh = mesh;               // Object 3D
        this.speed = speed;     
        this.baseSpeed = speed;        // Linear speed
        this.turnSpeed = turnSpeed;     // Rotation speed
        this.current = 0;               // Current index
        this.threshold = 15;            // Distance to switch waypoint

        // --- NEW LOGIC: Create unique path for this vehicle ---
        // We clone the original waypoints and add a random offset to X and Z.
        // This ensures this specific car has its own unique line.
        const MAX_OFFSET = 3; 
        
        this.waypoints = waypoints.map(point => {
            // Generates a random number between -3 and +3
            const offsetX = (Math.random() - 0.5) * 2 * MAX_OFFSET;
            const offsetZ = (Math.random() - 0.5) * 2 * MAX_OFFSET;

            // Clone the point so we don't mess up the original track data for others
            return new THREE.Vector3(
                point.x + offsetX,
                point.y, 
                point.z + offsetZ
            );
        });
        this.mesh.userData.follower = this;
    }

    update(dt) {
        if (this.waypoints.length === 0) return;

        const target = this.waypoints[this.current];

        // Direction from vehicle to target
        const direction = new THREE.Vector3()
            .subVectors(target, this.mesh.position)
            .normalize();

        // Current vehicle direction (Front is -X)
        const forward = new THREE.Vector3(-1, 0, 0)
            .applyQuaternion(this.mesh.quaternion);

        // Calculate rotation angles (ignoring Y height)
        const dirFlat = new THREE.Vector3(-direction.x, 0, direction.z).normalize();
        const fwdFlat = new THREE.Vector3(-forward.x, 0, forward.z).normalize();

        const desiredAngle = Math.atan2(dirFlat.z, dirFlat.x);
        const currentAngle = Math.atan2(fwdFlat.z, fwdFlat.x);

        // Calculate shortest rotation delta
        let delta = desiredAngle - currentAngle;
        delta = Math.atan2(Math.sin(delta), Math.cos(delta)); // Normalize to [-PI, PI]

        // Apply smooth rotation
        this.mesh.rotation.y += delta * this.turnSpeed * dt;

        // Move forward
        this.mesh.translateX(-this.speed * dt);

        // Distance check to switch to next waypoint
        // We ignore Y axis for distance check to prevent issues on ramps
        const distSq = (this.mesh.position.x - target.x) ** 2 + (this.mesh.position.z - target.z) ** 2;
        const thresholdSq = this.threshold * this.threshold;

        if (distSq < thresholdSq) {
            this.current = (this.current + 1) % this.waypoints.length;
        }
    }
}