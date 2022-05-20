import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Cube_Single_Strip extends Shape{
    constructor() {
        super("position", "normal");
        this.arrays.position = Vector3.cast(
            [1, 1, 1], [1, -1, 1], [-1, 1, 1], [-1, -1, 1],
            [-1, 1, -1], [-1, -1, -1], [1, 1, -1], [1, -1, -1])
        this.arrays.normal = this.arrays.position;
        this.indices.push(0, 3, 1, 5, 7, 4, 6, 2, 0, 3, 2, 5, 4, 7, 8, 1, 0);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        // When a set of lines is used in graphics, you should think of the list entries as
        // broken down into pairs; each pair of vertices will be drawn as a line segment.
        // Note: since the outline is rendered with Basic_shader, you need to redefine the position and color of each vertex
        this.arrays.position = Vector3.cast(
            [-1, 1, -1], [1, 1, -1], [1, 1, -1], [1, -1, -1], [1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, 1, -1],
            [-1, 1, 1], [1, 1, 1], [1, 1, 1], [1, -1, 1], [1, -1, 1], [-1, -1, 1], [-1, -1, 1], [-1, 1, 1],
            [-1, 1, -1], [-1, 1, 1], [1, 1, -1], [1, 1, 1], [-1, -1, -1], [-1, -1, 1], [1, -1, -1], [1, -1, 1]);
        this.arrays.color = [];
        for(let i = 0; i <= 23; ++i)
            this.arrays.color.push(hex_color("#ffffff"));
        this.indices = false;
    }
}

export class Final_project extends Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */

    constructor() {
        super();
        this.car_pos = [0, 0, 0];
        this.view_mode = 0;

        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'triangle_strip': new Cube_Single_Strip(),
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());

        //world view camera
        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 15), vec3(0, 1, -10), vec3(0, 1, 0));
    }

    //movement functions, change 0.1 to other value to control speed
    move_right() {
        this.car_pos[0] = this.car_pos[0] + 0.1;
    }

    move_left(){
        this.car_pos[0] = this.car_pos[0] - 0.1;
    }

    move_forward(){
        this.car_pos[2] = this.car_pos[2] - 0.1;
    }

    move_backward(){
        this.car_pos[2] = this.car_pos[2] + 0.1;
    }

    view_car(){
        this.view_mode = 1;
    }
    view_world(){
        this.view_mode = 0;
    }

    reset_car(){
        this.car_pos = [0, 0, 0];
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        //buttons to control movements
        this.key_triggered_button("Move left", ["a"], this.move_left);
        this.key_triggered_button("Move right", ["d"], this.move_right);
        this.key_triggered_button("Move forward", ["w"], this.move_forward);
        this.key_triggered_button("Move backward", ["s"], this.move_backward);

        //buttons to change camera
        this.new_line();
        this.key_triggered_button("Car View", ["Control", "1"], this.view_car);
        this.key_triggered_button("World View", ["Control", "2"], this.view_world);

        //functional buttons (e.g. reset)
        this.new_line();
        this.key_triggered_button("reset car", ["Control", "r"], this.reset_car);
    }

    draw_track(context, program_state, model_transform){
        //adjust z value to change the track
        model_transform = model_transform.times(Mat4.translation(0, 0, -13))
            .times(Mat4.scale(5, 0.01, 15));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic);
    }

    draw_car(context, program_state, model_transform){
        model_transform = Mat4.identity()
        model_transform = model_transform.times(Mat4.translation(0, 1, 0))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]));
        let car_color = hex_color("#bf9f92");
        this.shapes.cube.draw(context, program_state, model_transform,
            this.materials.plastic.override({color:car_color}));
        return model_transform;
    }


    display(context, program_state) {

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        //controlling the camera
        let desired = this.initial_camera_location;
        if(this.view_mode == 1){
            desired = Mat4.look_at(vec3(this.car_pos[0], this.car_pos[1] + 5, this.car_pos[2] + 7.5),
                vec3(this.car_pos[0], this.car_pos[1], this.car_pos[2] - 10), vec3(0, 1, 0));
        }
        else if(this.view_mode == 0) {
            desired = this.initial_camera_location;
        }
        desired = desired.map((x, i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.1));
        program_state.set_camera(desired);

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];


        let t = program_state.animation_time/1000;

        let model_transform = Mat4.identity();

        //draw track and car
        this.draw_track(context, program_state, model_transform);
        this.car = this.draw_car(context, program_state, model_transform);
    }
}