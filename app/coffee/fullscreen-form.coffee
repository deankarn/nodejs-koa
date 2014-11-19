define "fullscreen-form", ["main", "common"], (main, common) ->
    # console.log main
    # console.log common
    class FullscreenForm

        'use strict';

        animEndEventName = common.animationEndEventName()
        support = { animations : if animEndEventName == null then false else true }

        constructor: (@el, options) ->
            this.extend(this.options, options)
            this._init()

        extend: (a, b) ->
            for key of b
                # console.log b[key]
                a[key] = b[key] if b.hasOwnProperty key
            a

        options:
            # show progress bar
            ctrlNavProgress : true,
            # show navigation dots
            ctrlNavDots : true,
            # show [current field]/[total fields] status
            ctrlNavNumbers : true,
            # back button text, for internationalization
            ctrlBackText : 'Back',
            # next button text, for internationalization
            ctrlNextText : 'Next',
            # continue text, for internationalization
            ctrlContinueText : 'Continue',
            # continue subtext, for internationalization
            ctrlContinueSubtext : 'or press ENTER',
            # busy function to do whatever during bust aperations i.e. a saving indicator
            onBusy : null,
            #busy completed function
            onBusyComplete : null,
            # reached end, do you want to call a function for submitting or something...
            onCompete : null,
            #pass in onsubmit function
            #pass in validation array with name : function name = id or name of field
            # onReview : () ->
            #     false

        _init: () ->
            # the form element
            this.formEl = this.el.querySelector( 'form.ff-form' )

            # list of fields
            this.fieldsList = this.formEl.querySelector( 'ol.ff-field-list' )

            # current field position
            # this.current = 0
            this.currentIdx = 0

            # all fields
            this.fields = [].slice.call( this.fieldsList.children )

            # total fields
            this.fieldsCount = this.fields.length

            this.currentField = this.fields[this.currentIdx]
            # show first field
            common.addClass(this.currentField, 'ff-current-field')

            # create/add controls
            this._registerControls()

            # init events
            this._initEvents()

            # focus on first field
            this._focusOnCurrentFieldInput()

            true

        _registerControls: () ->

            # This should be redone so that nothing is added to the DOM until controls finished
            # main controls wrapper
            this.ctrls = common.createElement( 'div', { cName : 'ff-controls', appendTo : this.el } )

            # continue button (jump to next field)
            this.ctrlContinue = common.createElement( 'button', { cName : 'ff-continue', inner : this.options.ctrlContinueText, appendTo : this.ctrls } )
            this.ctrlContinue.setAttribute('data-subtext', this.options.ctrlContinueSubtext);
            this._showCtrl this.ctrlContinue

            # final error or success buttons
            this.ctrlBack = common.createElement( 'button', { cName : 'ff-back', inner : this.options.ctrlBackText, appendTo : this.ctrls } )
            this.ctrlNext = common.createElement( 'button', { cName : 'ff-next', inner : this.options.ctrlNextText, appendTo : this.ctrls } )

            # navigation dots
            if this.options.ctrlNavDots
                this.ctrlNav = common.createElement( 'nav', { cName : 'ff-nav-dots', appendTo : this.ctrls } )
                dots = ''
                for i in [0...this.fieldsCount] by 1
                    dots += if i == this.currentIdx then '<button class="ff-dot-current"></button>' else '<button disabled></button>'
                    # if i == this.currentIdx
                    #     this.currentNavDot = common.createElement 'button', { cName : 'ff-dot-current', appendTo : this.ctrlNav}
                    # else
                    #     common.createElement 'button', { disabled : true, appendTo : this.ctrlNav}

                this.ctrlNav.innerHTML = dots
                this._showCtrl this.ctrlNav
                this.ctrlNavDots = [].slice.call( this.ctrlNav.children )
                this.currentNavDot = this.ctrlNavDots[0]

            # field number status
            if this.options.ctrlNavNumbers
                this.ctrlNavNumberCt = common.createElement( 'span', { cName : 'ff-numbers', appendTo : this.ctrls } )

                # current field placeholder
                this.currentNavNumber = common.createElement( 'span', { cName : 'ff-number-current', inner : Number( this.currentIdx + 1 ), appendTo : this.ctrlNavNumberCt } )

                # total fields placeholder
                this.totalNavNumber = common.createElement( 'span', { cName : 'ff-number-total', inner : this.fieldsCount, appendTo : this.ctrlNavNumberCt } )

                this._showCtrl( this.ctrlNavNumberCt )

            # progress bar
            if this.options.ctrlNavProgress
                this.ctrlProgress = common.createElement( 'div', { cName : 'ff-progress', appendTo : this.ctrls } )
                this._showCtrl( this.ctrlProgress )

            this.msgError = common.createElement( 'span', { cName : 'ff-message-error', appendTo : this.el } )
            this.msgSuccess = common.createElement( 'span', { cName : 'ff-message-success', appendTo : this.el } )

            true

        _showCtrl: (ctrl) ->
            common.addClass(ctrl, 'ff-show')
            true

        _hideCtrl: (ctrl) ->
            common.removeClass( ctrl, 'ff-show')
            true

        _initEvents: () ->
            self = this

            # show next field
            this.ctrlContinue.addEventListener 'click', (e) ->
                self._nextField()
                true

            if this.options.ctrlNavDots
                this.ctrlNavDots.forEach ( dot, pos ) ->
                    dot.addEventListener 'click', (e)->
                        self._showField( pos )
                        true
                    true

            # Need to split out the input types somehow for custom dropdowns i.e. semanticui dropdown
            this.fields.forEach (fld) ->
                if not fld.hasAttribute "data-input-trigger"
                    return

                input = fld.querySelector( 'input' ) || fld.querySelector( 'select' )|| fld.querySelector( 'textarea' )

                switch input.tagName.toLowerCase()
                    when 'select'
                        input.addEventListener 'change', () ->
                             self._nextField()
                             true
                    when "input"
                        type = input.type.toLowerCase()
                        switch type
                            when 'radio', 'checkbox'
                                [].slice.call( fld.querySelectorAll "input[type='#{type}']").forEach (inp) ->
                                    inp.addEventListener 'change', (ev) ->
                                        self._nextField()
                                        true
                                    true
                            when 'text', 'password' #, 'hidden' hidden does not fire onchange event so...
                                input.addEventListener 'change', () ->
                                    self._nextField()
                                    true
                            when 'button'
                                input.addEventListener 'click', () ->
                                    self._nextField()
                                    true
                    when 'textarea'
                        input.addEventListener 'change', () ->
                            self._nextField()
                            true
                        # true
                true

            # keyboard navigation events - jump to next field when pressing enter
            document.addEventListener 'keydown', (e) ->

                if not self.isLastStep and not (e.target.tagName.toLowerCase() == 'textarea')
                    keyCode = e.keyCode || e.which
                    if keyCode == 13
                        e.preventDefault()
                        self._nextField()
                        false
                true

            true

        _nextField: (pos) ->

            if this.isBusy || this.isAnimating
                return

            this.isBusy = this.isAnimating = true
            this.nextIdx = pos
            this.isMovingBack = this.nextIdx != undefined
            this.isLastStep = if this.currentIdx == this.fieldsCount - 1 and not this.isMovingBack then true else false

            if this.nextIdx == undefined
                this.nextIdx = this.currentIdx + 1

            this._clearError()
            this._clearSuccess()
            #VALIDATE FIELD HERE IF NOT VALID...LEAVE

            this._hideCtrl this.ctrlBack
            this._hideCtrl this.ctrlNext

            self = this

            if this.isLastStep
                # show the complete form and hide the controls
                this._hideCtrl this.ctrlNav
                this._hideCtrl this.ctrlProgress
                this._hideCtrl this.ctrlContinue
                this._hideCtrl this.ctrlNavNumberCt
                common.removeClass this.currentField, 'ff-current-field'

                # fire busy indicator function
                if this.options.onBusy
                    this.options.onBusy()

                #fire onComplete, wait for results object
                if this.options.onComplete
                    this.options.onComplete (results, extra) ->

                        if results.error
                            if extra
                                self.ctrlBack.onclick = extra
                            else
                                self.ctrlBack.onclick = () ->
                                    self._nextField 0
                                    self._showCtrl self.ctrlNav
                                    self._showCtrl self.ctrlProgress
                                    self._showCtrl self.ctrlContinue
                                    self._showCtrl self.ctrlNavNumberCt
                                    true

                            self._showError results.message
                            self._showCtrl self.ctrlBack
                        else
                            if extra
                                self.ctrlNext.onclick = extra

                            self._showSuccess results.message
                            self._showCtrl self.ctrlNext

                        # fire busy indicator function
                        if self.options.onBusyComplete
                            self.options.onBusyComplete()

                        self.isBusy = self.isAnimating = false
                        true
                true
            else
                common.removeClass this.currentField, 'ff-current-field'
                common.addClass this.currentField, 'ff-hide'

                this.nextField = this.fields[this.nextIdx]
                this.nextNavDot = this.ctrlNavDots[this.nextIdx]

                this._updateNav()
                this._updateFieldNumber()
                this._progress()

                common.addClasses this.nextField, [ 'ff-current-field', 'ff-show']

                if this.nextField.hasAttribute 'data-hide-continue'
                    common.removeClass this.ctrlContinue, 'ff-show'
                else
                    common.addClass this.ctrlContinue, 'ff-show'

                if this.isMovingBack
                    common.addClass this.el, 'ff-show-prev'
                else
                    common.addClass this.el, 'ff-show-next'

                onEndAnimationFn = (e)->
                    # console.log 'end animation'
                    if support.animations
                        this.removeEventListener animEndEventName, onEndAnimationFn

                    common.removeClass self.currentField, 'ff-hide'
                    common.removeClass self.nextField, 'ff-show'

                    if self.isMovingBack
                        common.removeClass self.el, 'ff-show-prev'
                    else
                        common.removeClass self.el, 'ff-show-next'

                    if self.options.ctrlNavNumbers
                        self.currentNavNumber.innerHTML = self.nextNavNumber.innerHTML
                        self.ctrlNavNumberCt.removeChild self.nextNavNumber

                    self.currentIdx = self.nextIdx
                    self.currentField = self.nextField
                    self.currentNavDot = self.nextNavDot

                    self._focusOnCurrentFieldInput()

                    self.isBusy = self.isAnimating = false
                    true

                # console.log animEndEventName
                if support.animations
                    this.nextField.addEventListener animEndEventName, onEndAnimationFn
                else
                    onEndAnimationFn()

                true
            true

        _focusOnCurrentFieldInput: (el) ->
            # console.log this.currentField
            if el == undefined
                #explicitly selecting type to ensure a hidden input isn't selected
                el = this.currentField.querySelector('input[type="text"]') || this.currentField.querySelector('input[type="password"]') || this.currentField.querySelector('input[type="radio"]') || this.currentField.querySelector('input[type="checkbox"]') || this.currentField.querySelector('select') || this.currentField.querySelector('textarea')

            # if not element to focus in on
            if not el
                return

            switch el.tagName.toLowerCase()
                when 'select'
                    el.focus()
                when "input"
                    type = el.type.toLowerCase()
                    switch type
                        when 'radio', 'checkbox', 'button'
                            el.focus()
                        when 'text', 'textarea', 'password'
                            el.select()
            true

        _showField: (pos)->
            if pos == this.current or pos < 0 or pos > this.fieldsCount - 1
                return false
            this._nextField pos
            true

        _updateFieldNumber: ()->
            if this.options.ctrlNavNumbers

                this.nextNavNumber = document.createElement 'span'
                this.nextNavNumber.className = 'ff-number-new'
                this.nextNavNumber.innerHTML = Number this.nextIdx + 1

                # insert it in the DOM
                this.ctrlNavNumberCt.appendChild this.nextNavNumber
            true

        _progress: ()->
            if this.options.ctrlNavProgress
                this.ctrlProgress.style.width = this.nextIdx * ( 100 / this.fieldsCount ) + '%'
            true

        _updateNav: ()->
            if this.options.ctrlNavDots
                common.removeClass this.currentNavDot, 'ff-dot-current'
                common.addClass this.nextNavDot, 'ff-dot-current'
                this.nextNavDot.disabled = false

                if this.isMovingBack
                    for i in [this.fieldsCount - 1...this.nextIdx] by -1
                        this.ctrlNavDots[i].disabled = true
            true

        _showCtrl: (ctrl)->
            if ctrl
                common.addClass ctrl, 'ff-show'
            true

        _hideCtrl: (ctrl)->
            if ctrl
                common.removeClass ctrl, 'ff-show'
            true

        _validate: ()->

            fld = this.fields[ this.current ]
            input = fld.querySelector 'input[required]' or fld.querySelector 'textarea[required]' or fld.querySelector 'select[required]'

            if not input
                return true

            #not converting as want to implement custom error checking by function as the only means of validation

            # switch input.tagName.toLowerCase()
            #
            #
            # switch( input.tagName.toLowerCase() ) {
            # 	case 'input' :
            # 		if( input.type === 'radio' || input.type === 'checkbox' ) {
            # 			var checked = 0;
            # 			[].slice.call( fld.querySelectorAll( 'input[type="' + input.type + '"]' ) ).forEach( function( inp ) {
            # 				if( inp.checked ) {
            # 					++checked;
            # 				}
            # 			} );
            # 			if( !checked ) {
            # 				error = 'NOVAL';
            # 			}
            # 		}
            # 		else if( input.value === '' ) {
            # 			error = 'NOVAL';
            # 		}
            # 		break;
            #
            # 	case 'select' :
            # 		// assuming here '' or '-1' only
            # 		if( input.value === '' || input.value === '-1' ) {
            # 			error = 'NOVAL';
            # 		}
            # 		break;
            #
            # 	case 'textarea' :
            # 		if( input.value === '' ) {
            # 			error = 'NOVAL';
            # 		}
            # 		break;
            # }

            if not (error == undefined)
                this._showError error
                return false

            true

        _showSuccess: (message)->

            this.msgSuccess.innerHTML = message
            this._showCtrl this.msgSuccess
            true

        _showError: (message)->

            this.msgError.innerHTML = message
            this._showCtrl this.msgError
            true

        _clearError: ()->
            this._hideCtrl this.msgError
            true

        _clearSuccess: ()->
            this._hideCtrl this.msgSuccess
            true
