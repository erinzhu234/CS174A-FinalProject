import {defs, tiny} from './examples/common.js';
import {Text_Line} from "./examples/text-demo.js";

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong, Subdivision_Sphere,Square,Triangle} = defs;

export class Final_project extends Scene {
    constructor() {
        super();
        this.car_pos = [0, 0, 0];
        this.view_mode = 0;
        this.flag_rotate = 0;
//

        this.box1_pos = [-3,1,-51];
        this.box2_pos = [0,1,-240];
        this.box3_pos = [3,1,-170];

        this.box1_init = [-3,1,-51];
        this.box2_init = [0,1,-240];
        this.box3_init = [3,1,-170];

        this.box1_valid = 1;
        this.box2_valid = 1;
        this.box3_valid = 1;

        this.obj1_pos = [-3, 10, -100];
        this.obj2_pos = [5, 10, -200];
        this.obj3_pos = [-4, 10, -270];

        this.obj1_init = [-3, 10, -100];
        this.obj2_init = [3, 10, -200];
        this.obj3_init = [-2, 10, -270];

   //
        this.road_width = 4;

        this.elapsed_time = 0;

        this.win = 0;
        this.lose = 0;

        this.prize_count = 0;
        this.score = 0;

        this.best_score = 0;

        this.endline_mat = Mat4.identity();
        this.endline_mat = this.endline_mat
            .times(Mat4.translation(0, 0.01, -51))
            .times(Mat4.scale(5, 0.05, 1));

        this.shapes = {
            cube: new Cube(),
            torus: new defs.Torus(15, 15),
            text: new Text_Line(35),
            box_1: new Cube(),

        }



        this.materials = {
            car: new Material(new Textured_Phong(), {
                color: hex_color("#303030"),
                ambient: 1.0, diffusivity: 0.3, specularity: 0.5,
                texture: new Texture("assets/car.png")
            }),
            road: new Material(new Texture_Scroll_X(), {
                color: hex_color("#000000"),
                ambient: 1.0, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/road.png")
            }),
            static_road: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/road.png")
            }),
            wheel: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#505050")}),
            bg_front: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.8, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/background_front.png")
            }),
            bg_ground: new Material(new Texture_Scroll_X(), {
                color: hex_color("#000000"),
                ambient: 0.6, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/grass.png")
            }),
            bg_ground_static: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.6, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/grass.png")
            }),
            bg_left: new Material(new Texture_Scroll_left(), {
                color: hex_color("#000000"),
                ambient: 0.8, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/left.png")
            }),
            bg_left_static: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.8, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/left.png")
            }),
            bg_right: new Material(new Texture_Scroll_right(), {
                color: hex_color("#000000"),
                ambient: 0.8, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/right.png")
            }),
            bg_right_static: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.8, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/right.png")
            }),
            bg_sky: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.8, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/sky.png")
            }),
            endline: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/endline.png")
            }),
            text_image: new Material(new Textured_Phong(), {
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/text.png")
            }),
            obstacle_prize: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/bruinbox_1.png")
            }),
            obstacle_prize_out: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/kitty.png")
            }),
            building: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.9, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/building.png")
            }),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 7, 15), vec3(0, 5, -10), vec3(0, 1, 0));
    }

    //movement functions, change 0.1 to other value to control speed
    move_right() {

        if(this.flag_rotate > -Math.PI/4){
            this.flag_rotate = this.flag_rotate - 0.3;
        }
        if(this.car_pos[0] < this.road_width && !this.win && !this.lose) {
            this.car_pos[0] = this.car_pos[0] + 0.1;
        }
    }

    move_left(){
        if(this.flag_rotate < Math.PI/4){
            this.flag_rotate = this.flag_rotate + 0.3;
        }
        if(this.car_pos[0] > -1*this.road_width && !this.win && !this.lose) {
            this.car_pos[0] = this.car_pos[0] - 0.1;
        }
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
        //this.view_mode = 0;
        //this.flag_rotate = 0;

        this.box1_pos = [-3,1,-51];
        this.box2_pos = [0,1,-240];
        this.box3_pos = [3,1,-170];

        this.box1_init = [-3,1,-51];
        this.box2_init = [0,1,-240];
        this.box3_init = [3,1,-170];

        this.box1_valid = 1;
        this.box2_valid = 1;
        this.box3_valid = 1;

        this.obj1_pos = [-3, 10, -100];
        this.obj2_pos = [5, 10, -200];
        this.obj3_pos = [-4, 10, -270];

        this.obj1_init = [-3, 10, -100];
        this.obj2_init = [3, 10, -200];
        this.obj3_init = [-2, 10, -270];

        //
        this.road_width = 4;

        this.elapsed_time = 0;

        this.win = 0;
        this.lose = 0;

        this.prize_count = 0;
        this.score = 0;

        //this.best_score = 0;

        this.endline_mat = Mat4.identity();
        this.endline_mat = this.endline_mat
            .times(Mat4.translation(0, 0.01, -51))
            .times(Mat4.scale(5, 0.05, 1));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        //buttons to control movements
        this.key_triggered_button("Move left", ["a"], this.move_left);
        this.key_triggered_button("Move right", ["d"], this.move_right);
        //this.key_triggered_button("Move forward", ["w"], this.move_forward);
        //this.key_triggered_button("Move backward", ["s"], this.move_backward);

        //buttons to change camera
        this.new_line();
        this.key_triggered_button("Car View", ["Control", "1"], this.view_car);
        this.key_triggered_button("World View", ["Control", "2"], this.view_world);

        //functional buttons (e.g. reset)
        this.new_line();
        this.key_triggered_button("reset game", ["Control", "r"], this.reset_car);

        this.new_line();
        this.live_string(box => box.textContent = "Elapsed time: " + parseInt(this.elapsed_time));

        this.new_line();
        this.live_string(box => box.textContent = "Current Score: " + parseInt(this.score));
    }

    draw_track(context, program_state, model_transform) {
        //adjust z value to change the track
        if (this.win == 0 && this.lose == 0) {
            this.shapes.cube.draw(context, program_state,
                model_transform.times(Mat4.translation(0, 0, -20)).times(Mat4.scale(5, 0.01, 30)), this.materials.road);
        }
        else {
            this.shapes.cube.draw(context, program_state,
                model_transform.times(Mat4.translation(0, 0, -20)).times(Mat4.scale(5, 0.01, 30)), this.materials.static_road);
        }
    }

    draw_car(context, program_state, model_transform) {
        let car_color = hex_color("#ffffff");

        // draw the car body
        model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation(0, 1, 0))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]))
            .times(Mat4.scale(0.8, 0.6, 1.3));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.car.override({color: car_color}));

        // draw the lid
        model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation(0, 1.6, 0))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]))
            .times(Mat4.scale(0.8, 0.01, 1.3));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.car.override({color: car_color}));

        // draw the wheels
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(0.6, 0.4, 1))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]))
            .times(Mat4.rotation(Math.PI/2, 0, 1, 0))
            .times(Mat4.scale(0.4, 0.4, 0.6));
        this.shapes.torus.draw(context, program_state, model_transform, this.materials.wheel);
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(-0.6, 0.4, 1))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]))
            .times(Mat4.rotation(Math.PI/2, 0, 1, 0))
            .times(Mat4.scale(0.4, 0.4, 0.6));
        this.shapes.torus.draw(context, program_state, model_transform, this.materials.wheel);
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(0.6, 0.4, -1))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]))
            .times(Mat4.rotation(Math.PI/2, 0, 1, 0))
            .times(Mat4.scale(0.4, 0.4, 0.6));
        this.shapes.torus.draw(context, program_state, model_transform, this.materials.wheel);
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(-0.6, 0.4, -1))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]))
            .times(Mat4.rotation(Math.PI/2, 0, 1, 0))
            .times(Mat4.scale(0.4, 0.4, 0.6));
        this.shapes.torus.draw(context, program_state, model_transform, this.materials.wheel);

        // draw pole and flag
        car_color = hex_color("#101010");
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(0.6, 2.6, 1))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]))
            .times(Mat4.scale(0.05, 1, 0.05));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.wheel.override({color: car_color}));

        //flag rotates when turning left or right
        if(this.flag_rotate > 0.1){
            this.flag_rotate = this.flag_rotate - 0.1;
        }
        else if(this.flag_rotate < -0.1){
            this.flag_rotate = this.flag_rotate + 0.1;
        }


        car_color = hex_color("#ff0000");
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(0.6, 3.5, 1))
            .times(Mat4.translation(this.car_pos[0], this.car_pos[1], this.car_pos[2]))
            .times(Mat4.rotation(this.flag_rotate, 0, 1, 0))
            .times(Mat4.translation(0, 0, 0.2))
            .times(Mat4.scale(0.05, 0.1, 0.2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.wheel.override({color: car_color}));

        return model_transform;
    }

    draw_background(context, program_state, model_transform){
        // draw front background
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(0, 15, -50))
            .times(Mat4.scale(40, 30, 0.1));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.bg_front);

        // draw ground background
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(0, -0.1, -20))
            .times(Mat4.scale(40, 0.01, 30));
        if(this.win == 0 && this.lose == 0) {
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.bg_ground);
        }
        else {
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.bg_ground_static);
        }
        // draw left background
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(-20, 15, -20))
            .times(Mat4.scale(0.01, 30, 30));

        if(this.win == 0 && this.lose == 0) {
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.bg_left);
        }
        else {
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.bg_left_static);
        }

        // draw right background
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(20, 15, -20))
            .times(Mat4.scale(0.01, 30, 30));
        if(this.win == 0 && this.lose == 0) {
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.bg_right);
        }
        else {
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.bg_right_static);
        }


        // draw sky
        model_transform = Mat4.identity();
        model_transform = model_transform
            .times(Mat4.translation(0, 45, -20))
            .times(Mat4.scale(40, 0.01, 30));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.bg_sky);
    }

    draw_endline(context, program_state, dt){
        let move_amount = 0;
        if(this.elapsed_time < 35) {
            move_amount = dt * (51/5.);
        }
        else{
            this.win = 1;
            this.view_mode = 0;
            this.draw_win(context, program_state);
        }
        this.endline_mat = this.endline_mat.times(Mat4.translation(0, 0, move_amount));
        this.shapes.cube.draw(context, program_state, this.endline_mat, this.materials.endline);
    }


    draw_obstacle(context,program_state,model_transform){
        model_transform = Mat4.identity();
        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        this.box1_pos[2] = this.box1_init[2]+10*this.elapsed_time;
        this.box2_pos[2] = this.box2_init[2]+10*this.elapsed_time;
        this.box3_pos[2] = this.box3_init[2]+10*this.elapsed_time;


        let model_transform1 = model_transform.times(Mat4.translation(this.box1_pos[0], this.box1_pos[1], this.box1_pos[2])).times(Mat4.scale(0.6, 0.6, 0.6)).times(Mat4.rotation(this.elapsed_time*2,0,1,0));
        //this.shapes.box_1.draw(context, program_state, model_transform1, this.materials.obstacle_prize);

        let model_transform2 = model_transform.times(Mat4.translation(this.box2_pos[0], this.box2_pos[1], this.box2_pos[2])).times(Mat4.scale(0.6, 0.6, 0.6)).times(Mat4.rotation(this.elapsed_time*2,0,-1,0));
       // this.shapes.box_1.draw(context, program_state, model_transform2, this.materials.obstacle_prize);

        let model_transform3 = model_transform.times(Mat4.translation(this.box3_pos[0], this.box3_pos[1], this.box3_pos[2])).times(Mat4.scale(0.6, 0.6, 0.6)).times(Mat4.rotation(this.elapsed_time*2,0,-1,0));
        if(this.win == 0 && this.lose == 0) {

            if(this.car_pos[0] > this.box1_pos[0] - 1.4 && this.car_pos[0] < this.box1_pos[0] + 1.4
            && this.car_pos[2] > this.box1_pos[2] - 1.9 && this.car_pos[2] < this.box1_pos[2] + 1.9
            && this.box1_valid){
                this.box1_valid = 0;
                this.score = this.score + 20;
            }

            if(this.car_pos[0] > this.box2_pos[0] - 1.4 && this.car_pos[0] < this.box2_pos[0] + 1.4
                && this.car_pos[2] > this.box2_pos[2] - 1.9 && this.car_pos[2] < this.box2_pos[2] + 1.9
                && this.box2_valid){
                this.box2_valid = 0;
                this.score = this.score + 20;
            }

            if(this.car_pos[0] > this.box3_pos[0] - 1.4 && this.car_pos[0] < this.box3_pos[0] + 1.4
                && this.car_pos[2] > this.box3_pos[2] - 1.9 && this.car_pos[2] < this.box3_pos[2] + 1.9
                && this.box3_valid){
                this.box3_valid = 0;
                this.score = this.score + 20;
            }


            if(this.box1_valid)
                this.shapes.box_1.draw(context, program_state, model_transform1, this.materials.obstacle_prize);
            if(this.box2_valid)
                this.shapes.box_1.draw(context, program_state, model_transform2, this.materials.obstacle_prize);
            if(this.box3_valid)
                this.shapes.box_1.draw(context, program_state, model_transform3, this.materials.obstacle_prize);
        }

    }

    draw_object(context, program_state){
        this.obj1_pos[2] = this.obj1_init[2]+10*this.elapsed_time;
        this.obj2_pos[2] = this.obj2_init[2]+10*this.elapsed_time;
        this.obj3_pos[2] = this.obj3_init[2]+10*this.elapsed_time;

        let model_transform = Mat4.identity();

        let model_transform1 = model_transform.times(Mat4.translation(this.obj1_pos[0], 5, this.obj1_pos[2])).times(Mat4.scale(3, 5, 4));
        //this.shapes.box_1.draw(context, program_state, model_transform1, this.materials.obstacle_prize);

        let model_transform2 = model_transform.times(Mat4.translation(this.obj2_pos[0], 3, this.obj2_pos[2])).times(Mat4.scale(5, 3, 6));
        // this.shapes.box_1.draw(context, program_state, model_transform2, this.materials.obstacle_prize);

        let model_transform3 = model_transform.times(Mat4.translation(this.obj3_pos[0], 6, this.obj3_pos[2])).times(Mat4.scale(5, 6, 2));

        if(!this.win && !this.lose) {

            if (this.car_pos[0] > this.obj1_pos[0] - 3.8 && this.car_pos[0] < this.obj1_pos[0] + 3.8
                && this.car_pos[2] > this.obj1_pos[2] - 5.3 && this.car_pos[0] < this.obj1_pos[2] + 5.3) {
                this.lose = 1;
            } else
                this.shapes.cube.draw(context, program_state, model_transform1, this.materials.building);

            if (this.car_pos[0] > this.obj2_pos[0] - 5.8 && this.car_pos[0] < this.obj2_pos[0] + 5.8
                && this.car_pos[2] > this.obj2_pos[2] - 7.3 && this.car_pos[0] < this.obj2_pos[2] + 7.3) {
                this.lose = 1;
            } else
                this.shapes.cube.draw(context, program_state, model_transform2, this.materials.building);

            if (this.car_pos[0] > this.obj3_pos[0] - 5.8 && this.car_pos[0] < this.obj3_pos[0] + 5.8
                && this.car_pos[2] > this.obj3_pos[2] - 3.3 && this.car_pos[0] < this.obj3_pos[2] + 3.3) {
                this.lose = 1;
            } else
                this.shapes.cube.draw(context, program_state, model_transform3, this.materials.building);
        }
    }
//





    //
    draw_win(context, program_state) {
        // display words and score after the car passes endline
        let mat_win = Mat4.identity();
        mat_win = Mat4.translation(-17, 13, -30);
        this.shapes.text.set_string("Delivery Succeeded! ;)", context.context);
        this.shapes.text.draw(context, program_state, mat_win, this.materials.text_image);

        mat_win = mat_win.times(Mat4.translation(7, -3, 0));
        let score_string = "Your Score: " + this.score.toString();
        this.shapes.text.set_string(score_string, context.context);
        this.shapes.text.draw(context, program_state, mat_win, this.materials.text_image);

        mat_win = mat_win.times(Mat4.translation(0, -3, 0));
        score_string = "Best Score: " + this.best_score.toString();
        this.shapes.text.set_string(score_string, context.context);
        this.shapes.text.draw(context, program_state, mat_win, this.materials.text_image);
    }

    draw_lose(context, program_state){
        // display stuff like "delivery failed :(" after the car hits obstacle
        let mat_win = Mat4.identity();
        mat_win = Mat4.translation(-13, 13, -30);
        this.shapes.text.set_string("Delivery failed :(", context.context);
        this.shapes.text.draw(context, program_state, mat_win, this.materials.text_image);

        mat_win = mat_win.times(Mat4.translation(0, -3, 0));
        let score_string = "Your Score: " + this.score.toString();
        this.shapes.text.set_string(score_string, context.context);
        this.shapes.text.draw(context, program_state, mat_win, this.materials.text_image);

        mat_win = mat_win.times(Mat4.translation(0, -3, 0));
        score_string = "Press Ctrl+r to ";
        this.shapes.text.set_string(score_string, context.context);
        this.shapes.text.draw(context, program_state, mat_win, this.materials.text_image);

        mat_win = mat_win.times(Mat4.translation(0, -3, 0));
        score_string = "reset the game. ";
        this.shapes.text.set_string(score_string, context.context);
        this.shapes.text.draw(context, program_state, mat_win, this.materials.text_image);
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }


        //controlling the camera
        let desired = this.initial_camera_location;
        if (this.view_mode == 1) {
            desired = Mat4.look_at(vec3(this.car_pos[0], this.car_pos[1] + 4, this.car_pos[2] + 7.5),
                vec3(this.car_pos[0], this.car_pos[1], this.car_pos[2] - 10), vec3(0, 1, 0));
        } else if (this.view_mode == 0) {
            desired = this.initial_camera_location;
        }
        desired = desired.map((x, i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.1));
        program_state.set_camera(desired);

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];


        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        if(this.lose){
            this.draw_lose(context, program_state);
        }
        else {
            if (this.elapsed_time <= 50) {
                this.elapsed_time = this.elapsed_time + dt;
            }
            if (this.elapsed_time >= 30) {
                this.draw_endline(context, program_state, dt);
            }
        }

        if(this.score > this.best_score){
            this.best_score = this.score;
        }
        if(this.lose){
            this.view_mode = 0;
            this.draw_lose(context, program_state);
        }

        let model_transform = Mat4.identity();

        //draw track and car
        this.draw_track(context, program_state, model_transform);
        this.draw_car(context, program_state, model_transform);
        this.draw_background(context, program_state, model_transform);

        //draw obstacles
        this.draw_obstacle(context, program_state, model_transform);
        this.draw_object(context, program_state);
    }
}


class Texture_Scroll_X extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){// Sample the texture image in the correct place:
                float period_time = mod(animation_time, 64.);
                float shift_unit = period_time / 1.5;
                vec4 tex_color = texture2D( texture, vec2(f_tex_coord.x, f_tex_coord.y - shift_unit));
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w );
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}

class Texture_Scroll_right extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){// Sample the texture image in the correct place:
                float period_time = mod(animation_time, 64.);
                float shift_unit = period_time / 1.5;
                vec4 tex_color = texture2D( texture, vec2(f_tex_coord.x - shift_unit, f_tex_coord.y));
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w );
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}

class Texture_Scroll_left extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){// Sample the texture image in the correct place:
                float period_time = mod(animation_time, 64.);
                float shift_unit = period_time / 1.5;
                vec4 tex_color = texture2D( texture, vec2(f_tex_coord.x + shift_unit, f_tex_coord.y));
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w );
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}
