define ["main", "common"], (main, common) ->

    class FullscreenForm

        constructor: (@el, options) ->
            this.extend(this.options, options)
            this._init()

        extend: (a, b) ->
            for key of b
                console.log b[key]
                a[key] = b[key] if b.hasOwnProperty key
            a

        options:
            # show progress bar
            ctrlProgress : true,
            # show navigation dots
            ctrlNavDots : true,
            # show [current field]/[total fields] status
            ctrlNavPosition : true,
            # reached the review and submit step
            # onReview : () ->
            #     false

        _init: () ->
            # the form element
            this.formEl = this.el.querySelector( 'form.ff-form' )

            # list of fields
            this.fieldsList = this.formEl.querySelector( 'ol.ff-field-list' )

            # current field position
            this.current = 0

            # all fields
            this.fields = [].slice.call( this.fieldsList.children )

            # total fields
            this.fieldsCount = this.fields.length

            # show first field
            common.addClass(this.fields[this.current], 'ff-current-field')

            # create/add controls
            this._registerControls()

            # create/add messages
            this._addErrorMsg()

            # init events
            this._initEvents()

        _registerControls: () ->

            # This should be redone so that nothing is added to the DOM until controls finished
            # main controls wrapper
            this.ctrls = common.createElement( 'div', { cName : 'ff-controls', appendTo : this.el } )

            # continue button (jump to next field)
            this.ctrlContinue = common.createElement( 'button', { cName : 'ff-continue', inner : 'Continue', appendTo : this.ctrls } )
            this._showCtrl( this.ctrlContinue )

            # navigation dots
            if this.options.ctrlNavDots
                this.ctrlNav = common.createElement( 'nav', { cName : 'ff-nav-dots', appendTo : this.ctrls } )

                for i in [0...this.fieldsCount] by 1
                    if i == this.current
                        common.createElement 'button', { cName : 'ff-dot-current', appendTo : this.ctrlNav}
                    else
                        common.createElement 'button', { disabled : true, appendTo : this.ctrlNav}

                this._showCtrl( this.ctrlNav ) ;
                this.ctrlNavDots = [].slice.call( this.ctrlNav.children )

            # field number status
            if this.options.ctrlNavPosition
                this.ctrlFldStatus = common.createElement( 'span', { cName : 'ff-numbers', appendTo : this.ctrls } )

                # current field placeholder
                this.ctrlFldStatusCurr = common.createElement( 'span', { cName : 'ff-number-current', inner : Number( this.current + 1 ) } )
                this.ctrlFldStatus.appendChild( this.ctrlFldStatusCurr ) ;

                # total fields placeholder
                this.ctrlFldStatusTotal = common.createElement( 'span', { cName : 'ff-number-total', inner : this.fieldsCount } )
                this.ctrlFldStatus.appendChild( this.ctrlFldStatusTotal )
                this._showCtrl( this.ctrlFldStatus )

            # progress bar
            if this.options.ctrlProgress
                this.ctrlProgress = common.createElement( 'div', { cName : 'ff-progress', appendTo : this.ctrls } )
                this._showCtrl( this.ctrlProgress )

            true

        _showCtrl: (ctrl) ->
            common.addClass(ctrl, 'ff-show')
            true

        _hideCtrl: (ctrl) ->
            common.removeClass( ctrl, 'ff-show')
            true

        _addErrorMsg: () ->
            # error message
            this.msgError = common.createElement( 'span', { cName : 'ff-message-error', appendTo : this.el } )
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

                # for dot, i in this.ctrlNavDots
                #     dot.addEventListener 'click', (e) ->
                #         #i value here is incorrect!!!
                #         console.log i
                #         self._showField i
                #         true
                        # true

            #             this.ctrlNavDots.forEach( function( dot, pos ) {
			# 	dot.addEventListener( 'click', function() {
			# 		self._showField( pos );
			# 	} );
			# } );

            # Unsure if we really want this, or make them hit next?


            # jump to next field without clicking the continue button (for fields/list items with the attribute "data-input-trigger")
            # this.fields.forEach( function( fld ) {
            #     if( fld.hasAttribute( 'data-input-trigger' ) ) {
            #         var input = fld.querySelector( 'input[type="radio"]' ) || /*fld.querySelector( '.cs-select' ) ||*/ fld.querySelector( 'select' ); // assuming only radio and select elements (TODO: exclude multiple selects)
            #         if( !input ) return;
            #
            #         switch( input.tagName.toLowerCase() ) {
            #             case 'select' :
            #                 input.addEventListener( 'change', function() { self._nextField(); } );
            #                 break;
            #
            #             case 'input' :
            #                 [].slice.call( fld.querySelectorAll( 'input[type="radio"]' ) ).forEach( function( inp ) {
            #                     inp.addEventListener( 'change', function(ev) { self._nextField(); } );
            #                 } );
            #                 break;
            #
            #             /*
            #             // for our custom select we would do something like:
            #             case 'div' :
            #                 [].slice.call( fld.querySelectorAll( 'ul > li' ) ).forEach( function( inp ) {
            #                     inp.addEventListener( 'click', function(ev) { self._nextField(); } );
            #                 } );
            #                 break;
            #             */
            #         }
            #     }
            # } );

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

        _nextField: (backto) ->

            # console.log backto

            this.isLastStep = if this.current == this.fieldsCount - 1 and backto == undefined then true else false

            # console.log this.isLastStep
            # console.log this.isAnimating
            # console.log not this._validate()

            if this.isLastStep or this.isAnimating or not this._validate()
                return false

            this.isAnimating = true

            # this.isLastStep = if this.current == this.fieldsCount - 1 and backto == undefined then true else false

            # console.log this.isLastStep

            # clear any previous error messages
            this._clearError()

            # current field
            currentFld = this.fields[ this.current ]

            # save the navigation direction
            this.navdir = if not (backto == undefined) then (if backto < this.current then 'prev' else 'next') else 'next'

            # update current field
            this.current = if not (backto == undefined) then backto else this.current + 1
            this.farthest = this.current
            # if backto == undefined
            #     # update progress bar (unless we navigate backwards)
            #     # this._progress()
            #
            #     # save farthest position so far
            #     this.farthest = this.current

            # add class "fs-display-next" or "fs-display-prev" to the list of fields
            common.addClass this.fieldsList, "ff-display-#{this.navdir}"

            # remove class "ff-current-field" from current field and add it to the next one
            # also add class "ff-show" to the next field and the class "ff-hide" to the current one
            common.removeClass currentFld, 'ff-current-field'
            common.addClass currentFld, 'ff-hide'

            if not this.isLastStep
                # update nav
                this._updateNav()

                # change the current field number/status
                this._updateFieldNumber()
                this._progress()
                nextField = this.fields[ this.current ]
                common.addClass nextField, 'ff-current-field'
                common.addClass nextField, 'ff-show'

            # after animation ends remove added classes from fields
            self = this
            onEndAnimationFn = ()->
                common.removeClass self.fieldsList, "ff-display-#{self.navdir}"
                common.removeClass currentFld, 'ff-hide'

                if self.isLastStep
                    # show the complete form and hide the controls
                    self._hideCtrl self.ctrlNav
                    self._hideCtrl self.ctrlProgress
                    self._hideCtrl self.ctrlContinue
                    self._hideCtrl self.ctrlFldStatus
                    #change to continue button to finish
                    # self.options.onReview
                else
                    common.removeClass nextField, 'ff-show'

                    if self.options.ctrlNavPosition
                        self.ctrlFldStatusCurr.innerHTML = self.ctrlFldStatusNew.innerHTML
                        self.ctrlFldStatus.removeChild self.ctrlFldStatusNew
                        common.removeClass self.ctrlFldStatus, "ff-show-#{self.navdir}"

                self.isAnimating = false
                true
            onEndAnimationFn()
            true

        _showField: (pos)->
            if pos == this.current or pos < 0 or pos > this.fieldsCount - 1
                return false
            this._nextField pos
            true

        _updateFieldNumber: ()->
            if this.options.ctrlNavPosition
                # first, create next field number placeholder
                this.ctrlFldStatusNew = document.createElement 'span'
                this.ctrlFldStatusNew.className = 'fs-number-new'
                this.ctrlFldStatusNew.innerHTML = Number this.current + 1

                # insert it in the DOM
                this.ctrlFldStatus.appendChild this.ctrlFldStatusNew
                # this._progress()
                # add class "ff-show-next" or "ff-show-prev" depending on the navigation direction
                # self = this;
                # setTimeout( ()->
                #     common.addClass self.ctrlFldStatus, if self.navdir == 'next' then 'ff-show-next' else 'ff-show-prev'
                # 25)
            true

        _progress: ()->
            if this.options.ctrlProgress
                this.ctrlProgress.style.width = this.current * ( 100 / this.fieldsCount ) + '%'
            true

        _updateNav: ()->
            if this.options.ctrlNavDots
                common.removeClass this.ctrlNav.querySelector('button.ff-dot-current'), 'ff-dot-current'
                common.addClass this.ctrlNavDots[ this.current ], 'ff-dot-current'
                this.ctrlNavDots[ this.current ].disabled = false
                for i in [this.fieldsCount - 1...this.current] by -1
                    this.ctrlNavDots[ i ].disabled = true


            true

        _showCtrl: (ctrl)->
            common.addClass ctrl, 'ff-show'
            true

        _hideCtrl: (ctrl)->
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

        _showError: (err)->
            message = ''

            switch err
                when 'NOVAL'
                    message = 'Please fill the field before continuing'
                when 'INVALIDEMAIL'
                    message = 'Please fill a valid email address'

            this.msgError.innerHTML = message
            this._showCtrl this.msgError
            true

        _clearError: ()->
            this._hideCtrl this.msgError
            true
