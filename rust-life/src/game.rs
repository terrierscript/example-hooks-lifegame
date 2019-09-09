// copy from: https://github.com/bokuweb/rust-wasm-game-of-life/blob/master/src/game.rs
type Field<T> = Vec<Vec<T>>;

pub struct Game {
    field: Field<bool>,
}

impl Game {
    pub fn new(buf: &[bool], size: usize) -> Game {
        Game { 
            field: Game::create(buf, size, size) 
        }
    }

    // pub fn next(self) -> Vec<Vec<bool>> {
    pub fn next(self) -> Vec<u8> {
        self.field
            .iter()
            .enumerate()
            .map(|(y, r)| self.next_row(r, y))
            .flat_map(|x| x)
            .collect()
    }

    // fn next_row(&self, row: &[bool], y: usize) -> Vec<bool> {
    fn next_row(&self, row: &[bool], y: usize) -> Vec<u8> {
        row.iter()
            .enumerate()
            .map(|(x, _)| self.next_cell(y as i32, x as i32))
            .collect()
    }

    fn next_cell(&self, y: i32, x: i32) -> u8 {
        let alive_num = [
            (y - 1, x - 1),
            (y, x - 1),
            (y + 1, x - 1),
            (y - 1, x),
            (y + 1, x),
            (y - 1, x + 1),
            (y, x + 1),
            (y + 1, x + 1),
        ]
        .iter()
        .map(|&(y, x)| self.get_cell_state(y, x))
        .filter(|cell| *cell)
        // .collect::<Vec<_>>()
        // .len();
        .count();
        match alive_num {
            3 => 1,
            2 if self.is_alive(y as usize, x as usize) => 1,
            _ => 0,
        }
    }

    fn is_alive(&self, y: usize, x: usize) -> bool {
        self.field[y][x]
    }

    fn create(buf: &[bool], row_size: usize, col_size: usize) -> Field<bool> {
        (0..row_size)
            .map(|i| {
                let start = i * col_size;
                let end = start + col_size;
                buf[start..end].to_vec()
            })
            .collect()
    }

    fn get_cell_state(&self, row: i32, column: i32) -> bool {
        match self.field.get(row as usize) {
            Some(r) => match r.get(column as usize) {
                Some(c) => *c,
                None => false,
            },
            None => false,
        }
    }
}
