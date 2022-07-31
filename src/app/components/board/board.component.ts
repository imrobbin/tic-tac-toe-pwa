import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('squareBoard') squareBoard!: ElementRef<HTMLElement>;

  squares: string[] = [];
  xIsNext = false;
  winner = '';

  constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.newGame();
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  public newGame() {
    this.squares = Array(9).fill('');
    this.xIsNext = false;
    this.winner = '';
  }

  public makeMove(idx: number) {
    // if user click filled square or if game is won, return
    if (this.winner || this.squares[idx]) {
      return;
    }

    // put 'X' or 'O' in clicked square
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    this.winner = this.calculateWinner();
  }

  private calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        this.cd.detectChanges();
        let sb =
          this.squareBoard.nativeElement.querySelectorAll('app-square button');

        // set bg color for the winner
        let bg = this.squares[a] === 'O' ? '#ffae12' : '#7321db';
        lines[i].forEach((square) => {
          this.renderer.setStyle(sb[square], 'background-color', bg);
          this.renderer.setStyle(sb[square], 'color', '#f7f5f6');
        });

        return this.squares[a];
      }
    }
    return '';
  }
}
