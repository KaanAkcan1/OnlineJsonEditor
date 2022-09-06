var textEditor = {
    tab: 0,//kullandım
    selection: 0,//kullandım
    canPushCurlyBracketClose: false,//
    canPushSquareBracketClose: false,//
    isDoubleQuotesOpen: false,//kullandım
    isOpenBracket: false,//
    cleanedText: null,//kullandım
    htmlArray: [],//kullandım
    beforeArrayElement: null, //kullandım
    beforeText: null,//kullanıldı
    beforeButton: null,//kullanıldı
    text: null,
    html: null,
    init: function (e) {
        textEditor.organizeText(e, $('#text-area').val());

        $('#text-area').keyup(function (e) {
            if (textEditor.canPushCurlyBracketClose == false && e.key == '}')
                e.preventDefault();
            else if (textEditor.canPushSquareBracketClose == false && e.key == ']')
                e.preventDefault();
            else if (e.code == 'ControlLeft') {

            }
            else {
                textEditor.selection = this.selectionEnd;
                //if (e.key == ',' || e.key == '{' || e.key == '[' || e.key == ']' || e.key == '}') {
                //    textEditor.organizeText(e, $('#text-area').val());
                //}
                //else {
                //    $('#text').html($('#text-area').val());
                //    textEditor.beforeText = $('#text').html();
                //}
                textEditor.organizeText(e, $('#text-area').val());
            }
        });

        $('#text-area').keydown(function (e) {
            if (textEditor.canPushCurlyBracketClose == false && e.key == '}')
                e.preventDefault();

            if (textEditor.canPushSquareBracketClose == false && e.key == ']')
                e.preventDefault();

            if (e.key == '"') {
                if (textEditor.beforeButton == '"')
                    e.preventDefault();
                else {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    // set textarea value to: text before caret + tab + text after caret
                    this.value = this.value.substring(0, start) +
                        '""' + this.value.substring(end);

                    // put caret at right position again
                    this.selectionStart =
                        this.selectionEnd = start + 1;
                }
            }
            if (e.key == '{') {

                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                // set textarea value to: text before caret + tab + text after caret
                this.value = this.value.substring(0, start) +
                    '{}' + this.value.substring(end);

                // put caret at right position again
                this.selectionStart =
                    this.selectionEnd = start + 1;

            }
            if (e.key == '[') {

                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                // set textarea value to: text before caret + tab + text after caret
                this.value = this.value.substring(0, start) +
                    '[]' + this.value.substring(end);

                // put caret at right position again
                this.selectionStart =
                    this.selectionEnd = start + 1;

            }


            textEditor.beforeButton = e.key;

            if (e.key == 'Tab') {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                // set textarea value to: text before caret + tab + text after caret
                this.value = this.value.substring(0, start) +
                    "\t" + this.value.substring(end);

                // put caret at right position again
                this.selectionStart =
                    this.selectionEnd = start + 1;
            }
        });

    },
    organizeText: function (e, text) {
        if (text != "") {
            console.log(text);
            var arr = textEditor.textToArray(e, text);

            console.log(arr);
            var htmlArr = textEditor.createHtmlArray(e, arr);

            console.log(htmlArr);
            var htmlArrWithMarks = textEditor.addMarksToHtmlArray(e, htmlArr);

            console.log(htmlArrWithMarks);
            textEditor.arrangePushableButtons(e, htmlArr);

            var markedHtmlString = textEditor.createHtmlStringFromArray(e, htmlArrWithMarks);
            var htmlString = textEditor.createHtmlStringFromArray(e, htmlArr);

            console.log(markedHtmlString);
            console.log(htmlString);
            textEditor.appendTexts(e, htmlString, markedHtmlString);

            textEditor.arrangeCursor(e, markedHtmlString);

            textEditor.arrangeHeight(e, text);
        }
        else {
            textEditor.appendTexts(e, text, text);
        }
    },

    //#region TextToArray
    textToArray: function (e, text) {
        text = textEditor.clearText(e, text);

        return textEditor.transformToArray(e, text);
    },
    clearText: function (e, text) {
        text = text.replaceAll('\n', "");
        text = text.replaceAll('\t', "");
        /*text = text.replaceAll('  ', "");*/
        textEditor.cleanedText = text;
        return text;
    },
    transformToArray: function (e, text) {
        var result = textEditor.createArray(e, text, '"', null);
        result = textEditor.createArray(e, null, "[", result);
        result = textEditor.createArray(e, null, "}", result);
        result = textEditor.createArray(e, null, "]", result);
        result = textEditor.createArray(e, null, "{", result);
        result = textEditor.createArray(e, null, ",", result);
        result = textEditor.createArray(e, null, ':', result);
        result = result.filter(x => x != ' ');
        result = result.filter(x => x != '');
        return result;
    },
    createArray: function (e, text, key, arr) {
        var result = [];
        if (text == null) {
            for (var i = 0; i < arr.length; i++) {
                if (key != '"') {
                    if (arr[i] == '"') {
                        textEditor.isDoubleQuotesOpen = !textEditor.isDoubleQuotesOpen;

                        result.push(arr[i]);
                    }
                    else {
                        if (arr[i - 1] == '"' && arr[i + 1] == '"' && textEditor.isDoubleQuotesOpen) {
                            result.push(arr[i]);
                        }
                        else {
                            var resultArr = textEditor.textSplit(e, arr[i], key)

                            for (j = 0; j < resultArr.length; j++) {
                                result.push(resultArr[j]);
                            }
                        }
                    }
                }
                else {
                    var resultArr = textEditor.textSplit(e, arr[i], key)

                    for (j = 0; j < resultArr.length; j++) {
                        result.push(resultArr[j]);
                    }
                }
            }
        }
        else {
            result = textEditor.textSplit(e, text, key);
        }
        return result;
    },
    textSplit: function (e, text, key) {
        var result = [];

        if (text.includes(key)) {
            var splitArr = text.split(key);

            for (var j = 0; j < splitArr.length; j++) {
                if (j == splitArr.length - 1) {
                    result.push(splitArr[j].trim());
                }
                else {
                    result.push(splitArr[j].trim());
                    if (key == ':')
                        result.push(' ' + key + ' ');
                    else
                        result.push(key);
                }
            }
        }
        else {
            result.push(text);
        }
        return result;
    },
    //#endregion

    //#region CreateHtmlArray
    createHtmlArray: function (e, arr) {
        var htmlArr = textEditor.addSpacesToHtmlArray(e, arr);

        return htmlArr;
    },

    addSpacesToHtmlArray: function (e, htmlArr) {
        var resultArr = [];

        for (var i = 0; i < htmlArr.length; i++) {
            if (htmlArr[i] == '{' || htmlArr[i] == '[') {
                textEditor.tab = textEditor.tab + 1;

                var additionalString = "\n";

                for (var j = 0; j < textEditor.tab - 1; j++) {
                    additionalString = additionalString + "\t";
                }
                if (i != 0)
                    resultArr.push(additionalString);

                resultArr.push(htmlArr[i]);

                additionalString = additionalString + "\t";

                if (!(htmlArr[i + 1] == '{' || htmlArr[i + 1] == '[' || htmlArr[i + 1] == '}' || htmlArr[i + 1] == ']'))
                    resultArr.push(additionalString);
            }
            else if (htmlArr[i] == ',') {
                resultArr.push(htmlArr[i]);

                var additionalString = "\n";

                for (var j = 0; j < textEditor.tab; j++) {
                    additionalString = additionalString + "\t";
                }
                if (!(htmlArr[i + 1] == '{' || htmlArr[i + 1] == '['))
                    resultArr.push(additionalString);
            }
            else if (htmlArr[i] == '}' || htmlArr[i] == ']') {
                textEditor.tab = textEditor.tab - 1;

                var additionalString = "\n";

                for (var j = 0; j < textEditor.tab; j++) {
                    additionalString = additionalString + "\t";
                }

                resultArr.push(additionalString);

                resultArr.push(htmlArr[i]);

                if (htmlArr[i + 1] != ',') {
                    if (!(htmlArr[i + 1] == '{' || htmlArr[i + 1] == '[' || htmlArr[i + 1] == '}' || htmlArr[i + 1] == ']'))
                        resultArr.push("\n");
                }
            }
            else {
                resultArr.push(htmlArr[i]);
            }
        }

        return resultArr;
    },
    //#endregion

    //#region AddMarksToHtmlArray
    addMarksToHtmlArray: function (e, arr) {
        var resultArr = [];

        for (var i = 0; i < arr.length; i++) {
            //propStart
            //propEnd
            //stringStart
            //stringEnd
            //intStart
            //intEnd
            //comma
            //doubleDot
            var element = "";

            if (arr[i] == '"') {
                switch (textEditor.beforeArrayElement) {
                    case null:
                        textEditor.beforeArrayElement = "propStart";
                        break;
                    case "propStart":
                        textEditor.beforeArrayElement = "propEnd";
                        break;
                    case "propEnd":
                        if (arr[i - 1] == " : ")
                            textEditor.beforeArrayElement = "stringStart";
                        else
                            textEditor.beforeArrayElement = "propStart";
                        break;
                    case "stringStart":
                        textEditor.beforeArrayElement = "stringEnd";
                        break;
                    case "stringEnd":
                        textEditor.beforeArrayElement = "propStart";
                        break;
                    default:
                }
            }
            if (arr[i - 1] == '"') {
                switch (textEditor.beforeArrayElement) {
                    case null:
                        element = '<mark class="property">' + arr[i] + '</mark>';
                        break;
                    case "propStart":
                        element = '<mark class="property">' + arr[i] + '</mark>';
                        break;
                    case "propEnd":
                        element = arr[i];
                        break;
                    case "stringStart":
                        element = '<mark class="string">' + arr[i] + '</mark>';
                        break;
                    case "stringEnd":
                        /*element = '<mark class="string">' + arr[i] + '</mark>';*/
                        break;
                    default:
                }
            }

            if (element == '')
                element = arr[i];

            resultArr.push(element);
        }
        return resultArr;
    },
    //#endregion

    createHtmlStringFromArray: function (e, resultArr) {
        if (resultArr == undefined)
            return "";
        var result = resultArr[0];

        for (var k = 1; k < resultArr.length; k++) {
            result = result + resultArr[k];
        }

        textEditor.tab = 0;

        return result;
    },

    arrangePushableButtons: function (e, resultArr) {
        if (resultArr != undefined) {
            if (textEditor.countArrayElement(resultArr, '[') == textEditor.countArrayElement(resultArr, ']'))
                textEditor.canPushSquareBracketClose = false;
            else
                textEditor.canPushSquareBracketClose = true;

            if (textEditor.countArrayElement(resultArr, '{') == textEditor.countArrayElement(resultArr, '}'))
                textEditor.canPushCurlyBracketClose = false;
            else
                textEditor.canPushCurlyBracketClose = true;
        }
    },

    appendTexts: function (e, htmlString, markedHtmlString) {
        $('#text-area').val(htmlString);

        $('#text').html(markedHtmlString);

        $('.jsonForm').html("");
        $('.jsonForm').html(textEditor.cleanedText);

    },

    arrangeHeight: function (e, text) {
        var count = text.split("\n").length - 1;
        if (count > 10) {
            $('#text-area').css('min-height', (800 + (count / 20) * 500).toString() + "px");
            $('#text').css('min-height', (800 + (count / 20) * 500).toString() + "px");
            $('#backdrop').css('min-height', (800 + (count / 20) * 500).toString() + "px");
        }
    },

    arrangeCursor: function (e, text) {
        $('#text-area').focus();

        if (textEditor.beforeText != null) {
            var index = textEditor.selection;

            var controlArray = ['}', ']', '{', '['];

            if (e.key == ',') {
                index = index + (text.length - textEditor.beforeText.length - 1);
            }
            else if (controlArray.includes(this.beforeButton)) {
                /*index = index + (text.length - textEditor.beforeText.length - 1);*/
                index = index + ((text.length - textEditor.beforeText.length) / 2);
                textEditor.isOpenBracket = true;
            }
            else if (this.beforeButton == ':') {
                index = index + 1;
            }
            else if (textEditor.isOpenBracket) {
                index = index + (text.length - textEditor.beforeText.length - 2);

                textEditor.isOpenBracket = false;
            }

            $('#text-area')[0].setSelectionRange(index, index);
        }

        textEditor.beforeText = text;
    },

    countArrayElement(arr, key) {
        var result = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == key)
                result++;
        }
        return result;
    }
}