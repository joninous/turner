$(document).ready(function () {

    $(document).keydown(function (event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case "Enter":
                    event.preventDefault()
                    randomizeTurns()
                    break
                case "Delete":
                case "Backspace":
                    event.preventDefault()
                    deleteNames(false)
                    break
            }
        }
    })

    var nameField = $('#name-field')

    nameField.keydown(function (event) {
        if (!event.ctrlKey && event.key === "Enter") {
            event.preventDefault()
            addNameFromNameField()
        }
    })

    $('#add-button').click(function (event) {
        event.preventDefault()
        addNameFromNameField()
    })

    function addNameFromNameField() {
        var name = nameField.val()
        addName(name)
        nameField.val('')
        nameField.focus()
    }

    var turnsList = $('#turns-list')
    var namesList = $('#names-list')

    function addName(name, skipSaveToLocalStorage) {
        if (isBlank(name)) {
            return
        }

        function isBlank(string) {
            return (!string || /^\s*$/.test(string))
        }

        var upperCaseName = name.toUpperCase()

        // Remove special chars for id
        var nameCheckboxId = upperCaseName.replace(/[^\w\s]/gi, '') + '-checkbox'

        if ($('#' + nameCheckboxId).length > 0) {
            alert('Name "' + upperCaseName + '" is already on the list!')
            return
        }

        $('<div><input id="' + nameCheckboxId + '" type="checkbox" value="' + upperCaseName + '"><label for="' + nameCheckboxId +'">' + upperCaseName + '</label></div>').appendTo(namesList)

        turnsList.empty()

        if (!skipSaveToLocalStorage) {
            updateLocalStorage()
        }
    }

    $('#delete-selected-button').click(function (event) {
        event.preventDefault()
        deleteNames(true)
    })

    function deleteNames(checkedOnly) {
        var checkboxes = namesList.find('input[type=checkbox]' + (checkedOnly ? ':checked' : ''))
        if (checkboxes.length > 0) {
            checkboxes.parent().remove()
            turnsList.empty()

            updateLocalStorage()
        }
    }

    $('#delete-all-button').click(function (event) {
        event.preventDefault()
        deleteNames(false)
    })

    $('#randomize-turns-button').click(function (event) {
        event.preventDefault()
        randomizeTurns()
    })

    function randomizeTurns() {
        turnsList.empty()
        turnsList.css({
            'min-width': namesList.width()
        })

        var names = []
        namesList.find('input[type=checkbox]').each(function () {
            names.push($(this).val())
        })

        shuffleArray(names)

        // Durstenfeld shuffle, source: http://stackoverflow.com/a/12646864/1698168
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1))
                var temp = array[i]
                array[i] = array[j]
                array[j] = temp
            }
            return array
        }

        $.each(names, function (index, name) {
            turnsList.append('<div>' + (index + 1) + '. ' + name + '</div>')
        })
    }

    var localStorageNamesKey = 'turner.names'

    function updateLocalStorage() {
        var localStorageNames = []
        namesList.find('input[type=checkbox]').each(function () {
            localStorageNames.push($(this).val())
        })
        window.localStorage.setItem(localStorageNamesKey, JSON.stringify(localStorageNames))
    }

    loadNamesFromLocalStorage()

    function loadNamesFromLocalStorage() {
        var localStorageNames = JSON.parse(window.localStorage.getItem(localStorageNamesKey))
        if ($.isArray(localStorageNames)) {
            $.each(localStorageNames, function (index, name) {
                addName(name, true)
            })
        }
    }

    nameField.focus()

})
