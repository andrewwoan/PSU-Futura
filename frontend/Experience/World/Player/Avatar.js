import * as THREE from "three";
import Experience from "../../Experience.js";
import Nametag from "./Nametag.js";

export default class Avatar {
    constructor() {
        this.experience = new Experience();
        this.nametag = new Nametag();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
    }

    createAvatar(id, name = "anonymous") {
        const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const headMaterial = new THREE.MeshBasicMaterial({
            color: 0x002a83,
            // transparent: true,
            // opacity: 0.5,
        });
        const faceMaterial = new THREE.MeshBasicMaterial({ color: 0x0e56ee });

        const materials = [
            headMaterial,
            headMaterial,
            headMaterial,
            headMaterial,
            headMaterial,
            faceMaterial,
        ];

        console.log(headGeometry.groups);

        headGeometry.groups.forEach((face, i) => {
            face.materialIndex = i;
        });

        const head = new THREE.Mesh(headGeometry, materials);
        head.rotation.order = "YXZ";
        head.userData = id;

        const nametag = this.nametag.createNametag(32, 150, name);

        const bodyGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
        const bodyMaterial = new THREE.MeshBasicMaterial({
            color: 0x002a83,
            // transparent: true,
            // opacity: 0.5,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

        return { head, nametag, body };
    }

    update() {}
}
