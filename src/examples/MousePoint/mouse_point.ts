/**
 * @author Rick Battagline / https://embed.com
 */

import {WebGLRenderingContext, WebGLShader, WebGLProgram, WebGLBuffer, GLint, WebGLUniformLocation} from '../../WebGL';

// SRC_ALPHA
// ONE_MINUS_SRC_ALPHA
// prettier-ignore
let point_data: StaticArray<f32> = [
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
];

class Point {
  public x: f32 = 0.0;
  public y: f32 = 0.0;
  public alpha: f32 = 1.0;
  public visible: bool = false;
  public index: i32 = 0;

  constructor(index: i32) {
    this.index = index;
  }

  public activate(x: f32, y: f32): void {
    this.x = x;
    this.y = y;
    this.visible = true;
    this.alpha = 1.0;
  }

  public move(): void {
    this.alpha -= second_delta * 2;

    if (this.alpha < 0.0) {
      this.visible = false;
      this.alpha = 0.0;
    }

    point_data[this.index * 3] = this.x;
    point_data[this.index * 3 + 1] = this.y;
    point_data[this.index * 3 + 2] = this.alpha;
  }
}

const VERTEX_SHADER_CODE: string = `#version 300 es
  precision highp float;

  layout(location = 0) in vec2 position;
  layout(location = 1) in float alpha;
  out vec4 c;

  void main() {
    gl_Position = vec4( position.x, position.y, 0.0, 1.0 );
    gl_PointSize = 8.0;
    float a = clamp(alpha, 0.0, 1.0);
    c = vec4(1.0,1.0,0.0,a);

  }
`;
// THIS IS THE FRAGMENT SHADER
const FRAGMENT_SHADER_CODE: string = `#version 300 es
  precision highp float;
  in vec4 c;
  out vec4 color;

  void main() {
    color = c;
  }
`;

// initialize webgl
var second_delta: f32 = 0.0;
var gl = new WebGLRenderingContext('cnvs', 'webgl2');

let vertex_shader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertex_shader, VERTEX_SHADER_CODE);
gl.compileShader(vertex_shader);

let fragment_shader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragment_shader, FRAGMENT_SHADER_CODE);
gl.compileShader(fragment_shader);

let program: WebGLProgram = gl.createProgram();

gl.attachShader(program, vertex_shader);
gl.attachShader(program, fragment_shader);

gl.linkProgram(program);

gl.useProgram(program);

let buffer: WebGLBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

let position_al: GLint = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(position_al);
let alpha_al: GLint = gl.getAttribLocation(program, 'alpha');
gl.enableVertexAttribArray(alpha_al);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

let point_index: i32 = 0;

// prettier-ignore
let point_list: StaticArray<Point> = [
  new Point(0), new Point(1), new Point(2), new Point(3), new Point(4),
  new Point(5), new Point(6), new Point(7), new Point(8), new Point(9),
  new Point(10), new Point(11), new Point(12), new Point(13), new Point(14),
  new Point(15), new Point(16), new Point(17), new Point(18), new Point(19),
  new Point(20), new Point(21), new Point(22), new Point(23), new Point(24),
  new Point(25), new Point(26), new Point(27), new Point(28), new Point(29),
  new Point(30), new Point(31), new Point(32), new Point(33), new Point(34),
  new Point(35), new Point(36), new Point(37), new Point(38), new Point(39),
  new Point(40), new Point(41), new Point(42), new Point(43), new Point(44),
  new Point(45), new Point(46), new Point(47), new Point(48), new Point(49),
  new Point(50), new Point(51), new Point(52), new Point(53), new Point(54),
  new Point(55), new Point(56), new Point(57), new Point(58), new Point(59),
  new Point(60), new Point(61), new Point(62), new Point(63), new Point(64),
  new Point(65), new Point(66), new Point(67), new Point(68), new Point(69),
];

var prev_x: f32 = 0.0;
var prev_y: f32 = 0.0;

export function displayLoop(delta: i32, mouse_x: f32, mouse_y: f32): void {
  second_delta = <f32>delta / 1000.0;
  for (let i: i32 = 0; i < point_list.length; i++) {
    point_list[i].move();
  }

  if (prev_x != mouse_x || prev_y != mouse_y) {
    point_index++;
    if (point_index >= point_list.length) {
      point_index = 0;
    }
    point_list[point_index].activate(mouse_x, mouse_y);
    prev_x = mouse_x;
    prev_y = mouse_y;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bufferData<f32>(gl.ARRAY_BUFFER, point_data, gl.DYNAMIC_DRAW);

  //vertexAttribPointer     attribute |  dimensions | data type | normalize | stride bytes | offset bytes
  gl.vertexAttribPointer(position_al, 2, gl.FLOAT, +false, 12, 0);
  gl.vertexAttribPointer(alpha_al, 1, gl.FLOAT, +false, 12, 8);

  gl.drawArrays(gl.POINTS, 0, point_list.length);
}
