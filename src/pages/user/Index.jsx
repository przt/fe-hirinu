import React, { Component, Fragment} from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Password } from 'primereact/password';
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
// import { Rating } from 'primereact/rating';
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { UserService } from "../../service/UserService";
import authErrorResponse from "../../utils/AuthErrorResponse";


class User extends Component {
    constructor(props) {
        super(props);
        this.UserService = new UserService();
    }
    state = {
        dataAPI: [],
        displayDialog: false,
        user: {
            username: '',
            password: '',
            email: '',
            role: '',
        },
        selectedUser: {
            username: '',
            password: '',
            email: '',
            role: '',
        },
        globalFilter: '',
        setGlobalFilter: '',
        submitted: '',
    };

    //CONSUME API

    getUser = async () => {
        let user = await this.UserService.getUser();
        console.log("data user", user);
        if (user.status) {
            let error = authErrorResponse(user);
            this.growl.show(error);
        } else {
            this.setState({ dataAPI: await user.data });
        }
    };

    addUser = async () => {
        await this.UserService.postUser(this.state.user)
        await this.getUser()
        await this.setState({ user: { 
            username: '',
            password: '',
            email: '',
            role: '', } })
        await alert('add user successful')
    }

    updateUrl = async () => {
        let index = this.idSelectedUrl();
        await this.UserService.updateTbUrl(index, this.state.selectedUrl)
        await this.getTbUrl()
        await this.setState({
            selectedUrl: { url: '' },
            displayDialog: false
        })
        await alert('update tburl successful')
    }

    deleteUser = () => {
        let index = this.idSelectedUser();
        console.log('id user',index);
        this.UserService.deleteUser(index).then(() => {
            this.getUser()
        })
        this.setState({
            displayDialog: false,
            user: { 
                username: '',
                password: '',
                email: '',
                role: '', }
        })
    }
    //end
    idSelectedUser = () => {
        return this.state.selectedUser.id
    }

    openAddModal = () => {
        this.setState({
            displayDialog: true,
        });
        console.log("data display:", this.state.displayDialog);
    };
    hideModal = () => {
        this.setState({ 
            displayDialog: false,
        })
    }

    handleFormChange = (event) => {
        let usersNew = { ...this.state.user };
        usersNew[event.target.name] = event.target.value;
        this.setState({
            user: usersNew,
        });
    };

    async componentDidMount() {
        await this.getUser();
    }

    render() {
        const actionBodyTemplate = (rowData) => {
            return (
                <div className="actions">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" />
                    <Button icon="pi pi-trash" onClick={this.deleteUser} className="p-button-rounded p-button-warning mt-2" />
                </div>
            );
        };
        // let toast = useRef(null);

        const header = (
            <Fragment>
                <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 className="m-0">Manage User</h5>
                    <span className="block mt-2 md:mt-0 p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => this.setState.setGlobalFilter(e.target.value)} placeholder="Search..." />
                    </span>
                </div>
            </Fragment>
        );

        const leftToolbarTemplate = () => {
            return (
                <Fragment>
                    <div className="my-2">
                        <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={this.openAddModal} />
                    </div>
                </Fragment>
            );
        };

        const rightToolbarTemplate = () => {
            return (
                <Fragment>
                    <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                    <Button label="Export" icon="pi pi-upload" className="p-button-help" />
                </Fragment>
            );
        };
        const dialogFooter = (
            <>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.hideModal} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.addUser} />
            </>
        );

        return (
            <Fragment>
                <div className="grid crud-demo">
                    <div className="col-12">
                        <div className="card">
                            <Toast ref={(el) => (this.toast = el)} />
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                            <DataTable
                                value={this.state.dataAPI}
                                selection={this.state.selectedUser}
                                onSelectionChange={(e) => this.setState({ selectedUser: e.value })}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                globalFilter={this.state.globalFilter}
                                emptyMessage="No user found."
                                header={header}
                                responsiveLayout="scroll"
                            >
                                
                                <Column field="username" header="Username" headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                {/* <Column field="password" header="Password" headerStyle={{ width: "14%", minWidth: "10rem" }}></Column> */}
                                <Column field="email" header="Email" headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="role" header="Role" headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column header="Action" body={actionBodyTemplate}></Column>
                            </DataTable>

                            {/* Modal */}
                            <Dialog visible={this.state.displayDialog} style={{ width: "450px" }} header="User Details" modal className="p-fluid" footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}>
                                <div className="field">
                                    <label htmlFor="username">Username</label>
                                    <InputText value={this.state.user.username}
                                    name="username"
                                    onChange={this.handleFormChange} required autoFocus className={classNames({ "p-invalid": this.state.submitted && !this.state.user.username })} />
                                    {this.state.submitted && !this.state.user.username && <small className="p-invalid">Name is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="password">Password</label>
                                    <Password value={this.state.user.password}
                                    name="password" 
                                    onChange={this.handleFormChange} required autoFocus className={classNames({ "p-invalid": this.state.submitted && !this.state.user.password })} toggleMask />
                                    {this.state.submitted && !this.state.user.password && <small className="p-invalid">Password is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="email">Email</label>
                                    <InputText value={this.state.user.email}
                                    name="email" 
                                    onChange={this.handleFormChange} required autoFocus className={classNames({ "p-invalid": this.state.submitted && !this.state.user.email })} />
                                    {this.state.submitted && !this.state.user.email && <small className="p-invalid">Email is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="role">Role</label>
                                    <InputText value={this.state.user.role}
                                    name="role" 
                                    onChange={this.handleFormChange} required autoFocus className={classNames({ "p-invalid": this.state.submitted && !this.state.user.role })} />
                                    {this.state.submitted && !this.state.user.role && <small className="p-invalid">Role is required.</small>}
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default User;
