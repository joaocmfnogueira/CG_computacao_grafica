import * as THREE from 'three';

export class WaypointFollower {
    constructor(mesh, waypoints, maxSpeed = 25, turnSpeed = 2.5) {
        this.mesh = mesh;

        // Velocidade
        this.maxSpeed = maxSpeed;
        this.currentSpeed = 0;
        this.minSpeed = 2;

        // Aceleração / frenagem
        this.acceleration = 8;
        this.brakeDeceleration = 16;

        this.turnSpeed = turnSpeed;
        this.current = 0;

        this.threshold = 15;
        this.slowRadius = 45;

        // Curva
        this.maxTurnSlowdown = 0.6; // quanto a curva pode reduzir (0–1)

        this.waypoints = waypoints.map(p =>
            new THREE.Vector3(p.x, p.y, p.z)
        );
    }

    update(dt) {
        if (this.waypoints.length === 0) return;

        const target = this.waypoints[this.current];

        /* ======================
           DIREÇÃO E ROTAÇÃO
        ====================== */
        const direction = new THREE.Vector3()
            .subVectors(target, this.mesh.position)
            .normalize();

        const forward = new THREE.Vector3(-1, 0, 0)
            .applyQuaternion(this.mesh.quaternion);

        const dirFlat = new THREE.Vector3(-direction.x, 0, direction.z).normalize();
        const fwdFlat = new THREE.Vector3(-forward.x, 0, forward.z).normalize();

        const desiredAngle = Math.atan2(dirFlat.z, dirFlat.x);
        const currentAngle = Math.atan2(fwdFlat.z, fwdFlat.x);

        let delta = desiredAngle - currentAngle;
        delta = Math.atan2(Math.sin(delta), Math.cos(delta));

        this.mesh.rotation.y += delta * this.turnSpeed * dt;

        /* ======================
           CONTROLE DE VELOCIDADE
        ====================== */
        const dist = this.mesh.position.distanceTo(target);

        // --- Velocidade baseada na distância ---
        let speedByDistance = this.maxSpeed;
        if (dist < this.slowRadius) {
            const t = dist / this.slowRadius;
            speedByDistance = THREE.MathUtils.lerp(
                this.minSpeed,
                this.maxSpeed,
                t
            );
        }

        // --- Velocidade baseada na curva ---
        const turnIntensity = Math.min(Math.abs(delta) / Math.PI, 1);
        const curveSlowdown =
            1 - turnIntensity * this.maxTurnSlowdown;

        let speedByCurve = this.maxSpeed * (curveSlowdown ** 2);
        speedByCurve = Math.max(speedByCurve, this.minSpeed);

        // --- Velocidade alvo final ---
        const targetSpeed = Math.min(speedByDistance, speedByCurve);
        // console.log(turnIntensity);
        // console.log(curveSlowdown);
        // --- Acelera / freia suavemente ---
        if (this.currentSpeed < targetSpeed) {
            this.currentSpeed += this.acceleration * dt;
        } else {
            this.currentSpeed -= this.brakeDeceleration * dt;
        }

        // this.currentSpeed *= curveSlowdown;

        this.currentSpeed = THREE.MathUtils.clamp(
            this.currentSpeed,
            this.minSpeed,
            this.maxSpeed
        );

        /* ======================
           MOVIMENTO
        ====================== */
        this.mesh.translateX(-this.currentSpeed * dt);

        /* ======================
           TROCA DE WAYPOINT
        ====================== */
        if (dist < this.threshold) {
            this.current++;

            if (this.current >= this.waypoints.length) {
                this.current = 0;

                if (this.mesh.userData) {
                    this.mesh.userData.nBullets = 4;
                }
            }
        }
    }
}
