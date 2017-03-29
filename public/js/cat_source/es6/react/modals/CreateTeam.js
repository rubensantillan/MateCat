
class CreateTeam extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            errorInput: false,
            errorDropdown: false,
            textDropdown: 'Ex: joe@email.net',
            readyToSend: false
        };
        this.onLabelCreate = this.onLabelCreate.bind(this);
    }
    componentDidMount () {
        $(this.usersInput)
            .dropdown({
                allowAdditions: true,
                action: this.onLabelCreate,
            })
        ;
    }

    onLabelCreate(value, text){
        var self = this;
        if ( APP.checkEmail(text)) {
            $(this.usersInput)
                .dropdown('set selected', value);
            this.setState({
                errorDropdown: false
            });
            return true;
        } else {
            this.setState({
                errorDropdown: true
            });
            $(this.usersInput).dropdown('set text', text);

            return false;
        }
    }

    checkMailDropDown() {
        let mail = $(this.usersInput).find("input.search").val();
        return ( mail !== '' || APP.checkEmail(mail))
    }

    onInputFocus() {
        var self = this;
        let dropdownError = this.checkMailDropDown();
        setTimeout(function () {
            self.setState({
                errorInput: false,
                errorDropdown: dropdownError,
            });
        });

    }

    handleKeyPress(e) {
        if (this.inputNewOrg.value.length > 0 ) {
            this.setState({
                readyToSend: true,
            });
        } else {
            this.setState({
                readyToSend: false,
            });
        }
    }

    handleKeyUpInEmailInput(e) {
        if (e.key == 'Enter') return;
        let mail = $(this.usersInput).find("input.search").val();
        if (mail === '') {
            this.setState({
                errorDropdown: false,
            });
        }
        if (e.key === ' ') {
            this.onLabelCreate(mail, mail);
            $(this.usersInput).find("input.search").val('');
        }
    }


    onClick(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.inputNewOrg.value.length > 0 && !this.state.errorDropdown) {
            var members = ($(this.usersInput).dropdown('get value').length > 0) ? $(this.usersInput).dropdown('get value').split(",") : [];
            ManageActions.createTeam(this.inputNewOrg.value,  members);
            APP.ModalWindow.onCloseModal();
            this.inputNewOrg.value = '';
        } else if (this.inputNewOrg.value.length == 0 ) {
            this.setState({
                errorInput: true
            });
        }
        return false;
    }

    render() {
        var inputError = (this.state.errorInput) ? 'error' : '';
        var inputDropdown = (this.state.errorDropdown) ? 'error' : '';

        var buttonClass = (this.state.readyToSend && !this.state.errorInput && !this.state.errorDropdown ) ? '' : 'disabled';
        var user = APP.USER.STORE.user;
        return  <div className="create-team-modal">
            <div className="matecat-modal-top">
                <div className="ui one column grid left aligned">
                    <div className="column">
                        <p>Create a new team and invite your colleagues and collaborators to manage better all your MateCat projects.</p>
                        <h2>Assign a name to your team</h2>
                        <div className={"ui large fluid icon input " + inputError}>
                            <input type="text" placeholder="Team Name"
                                   onFocus={this.onInputFocus.bind(this)}
                                   onKeyUp={this.handleKeyPress.bind(this)}
                                   ref={(inputNewOrg) => this.inputNewOrg = inputNewOrg}/>
                            {/*<i className="icon-pencil icon"/>*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className="matecat-modal-middle">
                <div className="ui one column grid left aligned">
                    <div className="sixteen wide column">
                        <h2>Add members</h2>
                        <div className={"ui multiple search selection dropdown " + inputDropdown}
                             ref={(usersInput) => this.usersInput = usersInput}
                             onKeyUp={this.handleKeyUpInEmailInput.bind(this)} >
                            <input name="tags" type="hidden" />

                            {this.state.errorDropdown ? (
                                    <div className="default text"></div>
                                ) : (
                                    <div className="default text">insert email or emails separated by commas or press enter</div>
                                )}
                        </div>
                        {this.state.errorDropdown ? (
                                <div className="validation-error"><span className="text" style={{color: 'red', fontSize: '14px'}}>A valid email is required</span></div>
                            ): ''}
                    </div>
                    <div className="sixteen wide column">
                        <div className="ui members-list team">
                            <div className="ui divided list">
                                <div className="item">
                                    { APP.USER.STORE.metadata ? (
                                            <img className="ui mini circular image "
                                                 src={APP.USER.STORE.metadata.gplus_picture + "?sz=80"}/>
                                        ) : (
                                            <div className="ui tiny image label">{APP.getUserShortName(user)}</div>
                                        )}
                                    <div className="middle aligned content">
                                        <div className="content user"> {' ' + user.first_name + ' ' + user.last_name}</div>
                                        <div className="content email-user-invited">{user.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="matecat-modal-bottom">
                <div className="ui one column grid right aligned">
                    <div className="column">
                        <button className={"create-team ui primary button open " + buttonClass }
                                onClick={this.onClick.bind(this)}>Create</button>
                    </div>
                </div>
            </div>
        </div>;
        }
}


export default CreateTeam ;