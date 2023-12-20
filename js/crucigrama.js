"use strict";
class Crucigrama {

    nRows;
    nColumns;
    stringBoard;
    board;
    init_time;
    end_time;
    selectedCell=null;
    dificultad;
    timeDifference;

    constructor(dificultad){
        this.nRows=11;
        this.nColumns=9;
        this.dificultad=dificultad;
        this.stringBoard=this.getStringBoard(dificultad);
        this.board=this.start();
    }

    getStringBoard(dificultad){
        if(dificultad==='fácil'){
            return "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-"+
            ",.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-"+
            ",#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16";
        }else if(dificultad==='intermedio'){
            return "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-"+
            ",.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-"+
            ",#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
        }else{
            return "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-"+
            ",.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-"+
            ",.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";
        }
    }

    start(){
        var index=0;
        var arrayBoard=[];
        var values=this.stringBoard.split(',');
        for(var i=0;i< this.nRows;i++){
            var row=[];
            for(var j=0;j<this.nColumns;j++){
                var value= values[index];
                if(value==='.'){
                    row.push(0);
                }
                else if(value==='#'){
                    row.push(-1);
                }
                else{
                    row.push(value);
                }
                index++;
            }
            arrayBoard.push(row);
            }
        return arrayBoard;
    }

    paintMathword(){

        this.init_time = new Date();

        
        var mainElement = $("<main></main>");

        for(var i=0;i<this.nRows;i++){
            for(var j=0;j<this.nColumns;j++){
                var casilla = $("<p></p>");
                casilla.attr("data-row",i);
                casilla.attr("data-col",j);

                if(this.board[i][j]===0){
                    casilla.click(this.clickedCell.bind(casilla, this));
                }
                else if(this.board[i][j]===-1){
                    casilla.attr("data-state", "empty");
                }
                else{
                    casilla.text(this.board[i][j]);
                    casilla.attr("data-state", "blocked");
                }

                mainElement.append(casilla);
            }
        }
        $("body").append(mainElement);
    }

    clickedCell(crucigrama){
        crucigrama.removeOtherClicked();
        crucigrama.selectedCell=this;
        this.attr('data-state',"clicked");
    }
    
    removeOtherClicked() {
        $("p").each(function () {
            if(this.dataset.state==='clicked'){
                this.dataset.state='';
            }
        });
    }

    check_win_condition(){
        for(var i=0;i<this.nRows;i++){
            for(var j=0;j<this.nColumns;j++){
                if(this.board[i][j]==0){
                    return false;
                }
            }
        }
        return true;
    }

    calculate_date_difference(){
        var diff = this.end_time - this.init_time;

        var hours = Math.floor(diff / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    }

    introduceElement(key){
        var expression_row=true;
        var expression_col=true;

        if (this.selectedCell===null) {
            alert('Seleccione una celda antes de introducir un número.');
            return;
        }
        
        var selectedrow=this.selectedCell.attr('data-row');
        var selectedcol=this.selectedCell.attr('data-col');

        this.board[selectedrow][selectedcol]=key;

        
        expression_row=this.checkExpressionRow(selectedrow,selectedcol);
        expression_col=this.checkExpressionCol(selectedrow,selectedcol);

        if(expression_col && expression_row){
            var casilla = $(`p[data-row=${selectedrow}][data-col=${selectedcol}]`);
            this.selectedCell.attr('data-state',"correct");
            casilla.text(key);
            this.selectedCell=null;
        }else{
            this.board[selectedrow][selectedcol]=0;
            this.selectedCell.attr('data-state',"");
            this.selectedCell.text("");
            this.selectedCell=null;
            alert('El elemento introducido no es correcto para la casilla seleccionada');
        }

        var finish= this.check_win_condition();
        if(finish){
            this.end_time= new Date();
            this.timeDifference= this.calculate_date_difference();
            this.createRecordForm();
            alert('¡Enhorabuena! Has completado el crucigrama matemático en un tiempo de '+this.timeDifference);
        } 
    }

    checkExpressionRow(selectedrow,selectedcol){
        var first_number=0;
        var second_number=0;
        var expression;
        var result=0;

        if(selectedcol!=this.nColumns-1){
            for(var j=selectedcol;j<this.nColumns;j++){
                if(this.board[selectedrow][j]==-1){
                    break;
                }
                if(this.board[selectedrow][j]==='='){
                    first_number = this.board[selectedrow][j-3];
                    expression = this.board[selectedrow][j-2];
                    second_number = this.board[selectedrow][j-1];
                    result = this.board[selectedrow][j+1];
                    break;
                }
            }
        }

        if(first_number !=0 && second_number!=0 && result !=0){
            var mathExpression = [first_number, expression, second_number].join('');

            if (eval(mathExpression) != result) {
                return false;
            }
        }

        return true;

    }

    checkExpressionCol(selectedrow,selectedcol){
        var first_number=0;
        var second_number=0;
        var expression;
        var result=0;

        if(selectedrow!=this.nRows-1){
            for(var i=selectedrow;i<this.nRows;i++){
                if(this.board[i][selectedcol]==-1){
                    break;
                }
                if(this.board[i][selectedcol]==='='){
                    first_number = this.board[i-3][selectedcol];
                    expression = this.board[i-2][selectedcol];
                    second_number = this.board[i-1][selectedcol];
                    result = this.board[i+1][selectedcol];
                    break;
                }
            }
        }

        if(first_number !=0 && second_number!=0 && result !=0){
            var mathExpression = [first_number, expression, second_number].join('');
            if (eval(mathExpression) != result) {
                return false;
            }
        }

        return true;

    }

    createRecordForm() {
        var seconds = (this.end_time - this.init_time) / 1000;
    
        var section = $('<section>');

        section.append('<h4>Formulario de datos</h4>');
        
        var form = $('<form>', {
            action: '#',
            method: 'post',
            name: 'formulario'
        });
        
        form.append('<p><label for="nombre">Tu nombre:</label><input type="text" name="nombre" id="nombre"/></p>');
        form.append('<p><label for="apellidos">Tus apellidos:</label><input type="text" name="apellidos" id="apellidos"/></p>');
        form.append(`<p><label for="nivel">Nivel:</label><input type="text" name="nivel" id="nivel" value="${this.dificultad}" readonly/></p>`);
        form.append(`<p><label for="tiempo">Tiempo:</label><input type="text" id="tiempo" name="tiempo" value="${seconds}" readonly/></p>`);
        form.append('<p><label for="enviar">Enviar datos</label><input type="submit" id="enviar" value="Enviar"></p>');
        
        section.append(form);
        
        $('body').append(section);
    }

}