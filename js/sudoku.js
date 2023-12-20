"use strict";
class Sudoku {

  rows;
  columns;
  board=null;
  boardString;
  selectedCell=null;


  constructor(){
    this.rows=9;
    this.columns=9;
    this.boardString="3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6";
  }

  start() {
    this.board = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.columns }, (_, j) => 
        this.boardString[i * this.columns + j] === '.' ? 0 : parseInt(this.boardString[i * this.columns + j])
      )
    );
  }

  createStructure() {
    let htmlContent = "<main>";
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        htmlContent += `<p data-rowNumber="${i}" data-columnNumber="${j}">${this.board[i][j] || ''}</p>`;
      }
    }
    htmlContent += "</main>";
    document.write(htmlContent);
  }

  clickedCell(sudoku){
    sudoku.removeOtherClicked();
    sudoku.selectedCell=this;
    this.dataset.state='clicked';
    
  }

  removeOtherClicked(){
    var paragraphs=document.querySelectorAll("main p");
    paragraphs.forEach((paragraph) => {
      if(paragraph.dataset.state==='clicked'){
        paragraph.dataset.state='';
      }
    });
  }

  paintSudoku(){
    this.createStructure();

    var paragraphs=document.querySelectorAll("main p");

    paragraphs.forEach((paragraph) => {
      var value = paragraph.textContent;
      if (value === '') {
        paragraph.addEventListener('click', 
        this.clickedCell.bind(paragraph, this));
      }else{
        paragraph.dataset.state='blocked';
      }
    });

  }

  introduceNumber(number) {
    const num = parseInt(number);
    if (this.isNumberValid(num)) {
      this.placeNumber(num);
      this.checkCompleted();
    }
  }

  isNumberValid(num) {
    if (!this.checkRow(num)) {
      alert('Ya existe este número en su fila');
      return false;
    }
    if (!this.checkColumn(num)) {
      alert('Ya existe este número en su columna');
      return false;
    }
    if (!this.check3x3(num)) {
      alert('Ya existe este número en su cuadrícula 3x3');
      return false;
    }
    return true;
  }

  placeNumber(num) {
    const row = parseInt(this.selectedCell.dataset.rownumber);
    const col = parseInt(this.selectedCell.dataset.columnnumber);
    this.board[row][col] = num;
    this.selectedCell.textContent = num;
    this.selectedCell.dataset.state = 'correct';
    this.selectedCell = null;
  }

  checkCompleted(){
    var completed=true;
    for(var i=0;i<this.rows;i++){
      for(var j=0;j<this.columns;j++){
        if(this.board[i][j]==0){
          completed=false;
        }
      }
    }
    if(completed){
      alert('Felicidades, has completado el sudoku');
    }
  }

  checkRow(number) {
    const row = parseInt(this.selectedCell.dataset.rownumber);
    return !this.board[row].includes(number);
  }

  checkColumn(number) {
    const col = parseInt(this.selectedCell.dataset.columnnumber);
    return !this.board.some(row => row[col] === number);
  }

  check3x3(number) {
    const row = parseInt(this.selectedCell.dataset.rownumber);
    const col = parseInt(this.selectedCell.dataset.columnnumber);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[startRow + i][startCol + j] === number) {
          return false;
        }
      }
    }
    return true;
  }
}







