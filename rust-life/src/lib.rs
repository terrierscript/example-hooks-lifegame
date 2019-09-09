mod game;

extern crate wasm_bindgen;
use js_sys::*;
// use rand::Rng;
// use std::borrow::Borrow;
use wasm_bindgen::prelude::*;
// use rust_life::Game;


// fn log(message: String) {
//     web_sys::console::log_1(&format!("log: {}", message).into());
// }

#[wasm_bindgen]
pub fn main(size: JsValue, current: JsValue) -> Vec<u8> {
    // log(format!("{:?}", size));
    // log(format!("{:?}", current));
    let s: usize = size.as_f64()
        .unwrap_or_else(|| panic!("size panic")) as usize;
    // let mut rng = rand::thread_rng();

    let js_value = current;
    let arr: Array = js_value.into();
    let buff: Vec<bool> = arr
        .values()
        .into_iter()
        .map(|b| {
            let f: u32 = b
            .unwrap_or_else(|_bb| panic!("b panic"))
            .as_f64()
            .unwrap_or_else(|| panic!("as_f64 panic")) as u32;
            f == 1
        })
        .collect();
    // let buff: Vec<bool> = (0..(s * s)).map(|_| rng.gen::<f32>() < 0.5).collect();
    let buffsl = buff.as_slice();
    game::Game::new(buffsl, s).next()
}

// #[test]
// fn gen() {
//     let mut rng = rand::thread_rng();
//     println!("{}", rng.gen::<f32>());
//     println!("{}", rng.gen::<f32>() < 0.5);
//     assert!(false);
// }
