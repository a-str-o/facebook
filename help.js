import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import { ThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React from 'react';
import Spinner from "react-bootstrap/Spinner";
import NumberFormat from 'react-number-format';
// import EstimationCardDetails from '../EstimationCardDetails/';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import Communes from '../../../assets/communesleads.json';
import { theme } from '../../../assets/theme';
import Loading from "../../../Loading";
import Pagination from "../../../Pages/RapportEstimation/Pagination";
import EstimationMap from '../Estimations/components/EstimationCard/EstimationMap';
// import ReactMapGL, {Marker, FlyToInterpolator} from 'react-map-gl'
import filledNotStar from './../../../assets/img/filledNotStar.png';
import filledStar from './../../../assets/img/filledStar.png';
import NoLead from './NoLead';
import './style.scss';




const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



class Dossiers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded : false,
      leads : [],
      estimations : [],
      loading : true,
      noLead : false,
      openLeadDelete : false,
      allLeads: [],
      allLeadsFilter: [], 
      currentLeads: [], 
      currentPage: null,  
      totalPages: null ,

      openPopup: false,
      checkedB: false,
      
      //Echeance du priject
      ventEnCours : false,
      ventDesQuePoosible : false, 
      vent3mois : false,  
      plusde3mois : false, 
      ventPlusDe6Mois : false,
      priseInformation : false,
      mettreLocation : false,
      ventEtAchat : false,

      projectsFilter : [],
      //Communes

      //////SET commune to list for Autocomplete Multiple ////
      commune: [],
      /// NO NEED FOR THIS, SEE HOW THE CODE CHANGED
      communeTrue : false,
      brossac : false,
      champagnac : false, 
      clerac : false,  
      FleacSurSeugne : false, 
      guitinieres : false,
      jonzac : false,
      //....

      //profile
      profile : false,
    }
    
}
onPageChanged = data => {
  console.log(this.state.allLeadsFilter)
  const { allLeadsFilter } = this.state;
  const { currentPage, totalPages, pageLimit } = data;
  const offset = (currentPage - 1) * pageLimit;
  const currentLeads = allLeadsFilter.slice(offset, offset + pageLimit);
  this.setState({ currentPage, currentLeads, totalPages });
  ////WE DON'T NEED this getCurrentLeadsDetails as the data in the estimation is already in the this.state.allLeads array
  // this.getCurrentLeadsDetails(currentLeads).then(()=>{

  //   this.setState({ currentPage, currentLeads, totalPages });
  //   this.setState({loading : false})
  // })
}
popup() {
  if (!this.state.openPopup)
    this.setState({openPopup : true})
  else
    this.setState({openPopup : false})
}
applyFilter(selectedFilters){
  let slicerIndex = Math.min(5,selectedFilters.length)
  this.setState({ currentLeads : selectedFilters.slice(0,slicerIndex)})       
}

all(){
  //restart

  //5 here is the number that we have in the pagination
  this.applyFilter(this.state.allLeads)       
}


handleExpandClick(key){
  this.setState({expanded : key})
  }
  handleExpandClose(){
    this.setState({expanded : false})
    }

getAllLeads(){
  let leads = []
  axios.get('https://us-central1-agenz-website-prod.cloudfunctions.net/api/allLeads').then( (res) => {
    if(res.data.length >0){
  res.data.forEach( lead => {
    axios.post('https://us-central1-agenz-website-prod.cloudfunctions.net/api/getEstimation', {id : lead.estimationId}).then( (res) => {
    lead.estimation = res.data
    leads.push(lead)
    this.setState( {leads : leads})

  
    this.setState({loading : false})

  })
})
    }
    else {
      this.setState({loading : false, noLead : true})
    }

}) 
.catch(err => {
  //console.log(err.data)
})
}
getCurrentLeadsDetails(list_leads){
  let l = list_leads.length
  let count = 1
  return new Promise((resolve,reject)=> {
    let leads = []
    list_leads.forEach( lead => {
      axios.post('https://us-central1-agenz-website-prod.cloudfunctions.net/api/getEstimation', {id : lead.estimationId}).then( (res) => {
        lead.estimation = res.data
        leads.push(lead)
        this.setState( {currentLeads : leads})
        
        if (count === l ){
          resolve(count)
        }
        count = count+1
      })
    

  })
})
}
getLeadsDetails(list_leads){
  let l = list_leads.length
  let count = 1
  return new Promise((resolve,reject)=> {
    let leads = []
    list_leads.forEach( lead => {
      axios.post('https://us-central1-agenz-website-prod.cloudfunctions.net/api/getEstimation', {id : lead.estimationId}).then( (res) => {
        lead.estimation = res.data
        leads.push(lead)
        this.setState( {leads : leads})
        this.setState( {allLeads : leads})


        
        if (count === l ){
          resolve(count)
        }
        count = count+1
      })
    

  })
})
}
getMyLeads(){
  axios.post('https://us-central1-agenz-website-prod.cloudfunctions.net/api/myLeads', 
    {uid : this.props.uid}).then( (res) => {
    if(res.data.length >0){
      this.setState({leads : res.data})
      this.setState({allLeads : res.data
          .sort((a, b) =>{
              if(b.createdate._seconds > a.createdate._seconds)
                  return(1)
              else
                  return(-1)
                })})

              //Initializing the allLeadsFilter state with allLeads
              this.setState({allLeadsFilter : this.state.allLeads.slice()})

                
      this.setState({loading : false})


}
else {
  this.setState({loading : false, noLead : true})
}
})
.catch(err => {
  console.log(err)
  if(err.response.data.code === "auth/id-token-expired"){
    toast.error("Votre session à expiré pour des raisons de sécurité, veuillez vous reconnecter")
    this.props.dispatch({type : "SIGN_OUT"})
  }
})
}



componentDidMount(){
  this.getMyLeads()
}
handleChange = (event) => {
  this.setState({ ...this.state, [event.target.name]: event.target.checked });
};

handleChangeType = (event) => {
  this.setState({ ...this.state, [event.target.name]: event.target.checked });
  //The item is being checked, I added to the list
  if(event.target.checked){
this.setState({projectsFilter : [...this.state.projectsFilter, event.target.name]})
  }
  else{
  //The item is being unchecked, I remove it from the list
let projectFilterCopy = this.state.projectsFilter.slice() 
const index = projectFilterCopy.indexOf(event.target.name);
//double check that the item is in the list
if (index > -1) {
  projectFilterCopy.splice(index, 1);
}
this.setState({projectsFilter : projectFilterCopy})

  }
};

pushToCommuneState(newValue){
  console.log(newValue)
  // this.setState({communeTrue : true})
  let newCommuneState = []
  newValue.map(item => {
    newCommuneState.push(item.name)
    
  })
  this.setState({commune : newCommuneState})
}


SubmitFilter= () => {
  this.setState({loading : true})

//FILTER ONE "Mes projets en traitement"

let selectedFilters = this.state.allLeads
if(this.state.checkedB){
  //Filter only thos that the user has the contact (with this.props.uid in the arraw lead.handled)
  selectedFilters = this.state.allLeads.filter(x => {
    if(x.handled){
        if(x.handled.includes(this.props.uid)){
          return true
        }
    }
      return false
  })
  console.log(selectedFilters)
  this.applyFilter(selectedFilters)
  this.setState({allLeadsFilter : selectedFilters})
}
// if(!this.state.checkedB){
  //// THE TWO FOLLOWING FUNCTIONS ARE ONLY NECESSARY AT THE END OF ALL FILTERS
  // this.applyFilter(selectedFilters)
  // this.setState({allLeadsFilter : selectedFilters})
// }

//ISN'T IT BETTER TO USE if(this.state.commune.length > 0), you set communeTrue onChange in Autocomplete, but commune could be empty and communeTrue = True
//if (this.state.communeTrue){
  if(this.state.commune.length>0){
    selectedFilters = selectedFilters.filter(x => {
      return this.state.commune.includes(x.commune)
    })
  }
  // WHY USE OBject.keys ? selectedFilters is a list (array) not a JSON object

  //   Object.keys(selectedFilters)
  //   .filter(key => !this.state.commune.includes(key))
  //   .forEach(key => delete selectedFilters[key]);

  //   console.log(selectedFilters)
    
  //   this.applyFilter(selectedFilters)
  //   this.setState({allLeadsFilter : selectedFilters})
  //   this.setState({commune : []})
  // }
  if(this.state.ventEnCours){
    selectedFilters = selectedFilters.filter(x => {
      return x.projet_vente == "Oui, j\'ai déjà commencé la vente"
    })
  }

  if(this.state.ventDesQuePossible){
    selectedFilters = selectedFilters.filter(x => {
      return x.projet_vente == "Oui dès que possible"
    })
  }

  if(this.state.vent3mois){
    selectedFilters = selectedFilters.filter(x => {
      return x.projet_vente == "Oui d\'ici 3 mois"
    })
  }

  if(this.state.plusde3mois){
    selectedFilters = selectedFilters.filter(x => {
      return x.projet_vente == "Oui dans plus de 3 mois"
    })
  }

  if(this.state.mettreLocation){
    selectedFilters = selectedFilters.filter(x => {
      return x.projet_vente == "Non, je veux le mettre en location"
    })
  }

  if(this.state.ventEtAchat){
    selectedFilters = selectedFilters.filter(x => {
      return x.projet_vente == "Non, je viens de le vendre"
    })
  }
  if(this.state.pasdeProjet){
    selectedFilters = selectedFilters.filter(x => {
      return x.projet_vente == "Non je n\'ai pas de projet"
    })
  }

  this.applyFilter(selectedFilters)
  this.setState({allLeadsFilter : selectedFilters})
this.setState({loading : false})
//NO NEED FOR THIS ANYMORTE I THINK
// this.setState({communeTrue : false})
  //close popup
  this.popup() 
}
meetLead(uid, estimationId){
  axios.post('https://us-central1-agenz-website-prod.cloudfunctions.net/api/meetLead',{uid : uid, estimationId : estimationId}).then((res) => {
    // toast.success("Rendez-vous demandé")
    this.props.dispatch({type :'PRO_SET_NOTIFICATIONS', data : parseInt(this.props.notifications)-1})
})
.catch(err => {
  toast.error("Impossible de prendre rendez-vous. Le lead n'est peut-être plus disponible, contactez-nous si le problème persiste")
  //console.log(err.data)
})
}
  deleteLead(){
  axios.post('https://us-central1-agenz-website-prod.cloudfunctions.net/api/deleteLeads',{uid : this.props.uid, estimationId : this.state.leadToDelete}).then( (res) => {
  toast.success("Lead supprimé avec succès")
  this.setState({leads : this.state.leads.filter(lead => lead.estimationId !== this.state.leadToDelete )})
  this.setState({leadToDelete : undefined})
  this.setState({openLeadDelete : undefined})
  if (this.props.notifications > 0){
  this.props.dispatch({type : "PRO_SET_NOTIFICATIONS", data :  parseInt(this.props.notifications)-1})
  }


  }).catch(err=>
  {
  //console.log(err)
  toast.error("Impossible de supprimer ce lead pour le moment")
})
  }
  formatDate(dateEstimation){
    let date = new Date(dateEstimation);   
return (date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear())

  }
  handleClick(){
this.setState({openPopup : true})
  }

  
  render() {
    const { allLeadsFilter} = this.state;
    const totalLeads = allLeadsFilter.length;

  
        return (
          <>
                      <div className="estimations-display--container estimations-display--container-dossiers">
                      <Dialog
            open={this.state.openLeadDelete}
            onClose = {()=> {this.setState({openLeadDelete : false})}}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
                <DialogContent>
                    <DialogContentText id="alert-dialog-localisation-error">
                        <div  className="text-center">
                            <h5>Vous êtes sur le point de supprimer un lead</h5>
                            <p>Cette opération est irréversible. Souhaitez-vous continuer ?</p>
                            <button className="button button-primary" style={{marginRight : '10px'}} onClick={()=> {this.setState({openLeadDelete : false})}} >
                                Non
                            </button>
                            <button className="button button-primary button--secondary"onClick={() => {this.deleteLead()}} >
                                {/* alert("okk")
                                this.setState({openConfirmationModal : false})
                                this.setState({lookingForZone : true})
                                this.checkPointInZone()
                                // if (
                                //     this.props.estimationStatePro.estimation.zone &&
                                //     this.props.estimationStatePro.marker.latitude &&
                                //     this.props.estimationStatePro.marker.longitude
                                // ) {
                                //     this.props.dispatch({ type: 'PRO_CONFIRM_ADDRESS_SELECTION'});   
                                // }
                            }}> */}
                                Oui, ce lead ne m'intéresse pas
                            </button>
                            
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            {/* <Dialog
            open={this.state.openMeetingModal}
            onClose = {()=> {this.setState({openMeetingModal : false})}}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
                <DialogContent>
                    <DialogContentText id="alert-dialog-localisation-error">
                        <div  className="text-center">
                            <h5>Rendez-vous demandé</h5>
                            <p>Vous pouvez maintenant prendre contact avec l'utilisateur</p>
                            <button className="button button-primary" style={{marginRight : '10px'}} onClick={()=> {this.setState({openMeetingModal : false})}} >
                                C'est noté
                            </button>
                            
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog> */}

        {!this.state.loading ? (
            this.state.noLead || this.state.leads.length < 1 ? (
              <NoLead />
            )  : (
            <div className = "container-dossiers">
      <ThemeProvider theme={theme}>

              <div className="right-pannel-title">
                <div className="title--container">
                          <div  className="flex justify-center items-center flex-grow space-x-6 md:space-x-2">
                            
                                    <h5 className= "agence--title">Les leads disponibles</h5>
                          
                          </div>
                    </div>
                        <div>
                          {this.state.openPopup ? 
                          <div className="popup">
                            <div className="popup-inner">
                              <h5  className="agence--title">Filtrer les résultats</h5>
                                <svg  onClick={() => { this.popup() }} xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              <hr/>
                              <div className="flex space-x-4 mt-6  items-center flex-grow">
                                <h6>Afficher uniquement mes projets en traitement</h6>
                                  <Switch
                                    className="mr-2"
                                    checked={this.state.checkedB}
                                    onChange={this.handleChange}
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                  />
                                </div>
                                <hr/>
                                
                                <h6 className="mt-2">Type de projet</h6>
                                <Grid container spacing={1}>
                                <Grid item xs={12} md={6}>      
                                <div className="form-group--container">                    
                                  <FormGroup row>
                                      <FormControlLabel
                                          control={
                                              <Checkbox iconStyle={{fill: '#2EA7F9'}}
                                                  checked={this.state.ventEnCours}
                                                  onChange={this.handleChangeType}
                                                  name="ventEnCours"
                                              />
                                          }
                                          label="J'ai deja commence la vente"
                                      />
                                  </FormGroup>
                                  </div>  
                                </Grid>
                              <Grid item xs={12} md={6} >                            
                              <FormGroup row>
                                  <FormControlLabel
                                      control={
                                          <Checkbox iconStyle={{fill: '#2EA7F9'}}
                                              checked={this.state.ventDesQuePossible}
                                              onChange={this.handleChangeType}
                                              name="ventDesQuePossible"
                                          />
                                      }
                                      label="Dès que possible"
                                  />
                              </FormGroup>
                              </Grid>
                                    <Grid item xs={12} md={6} >                            
                                    <FormGroup row>
                                  <FormControlLabel
                                      control={
                                          <Checkbox iconStyle={{fill: '#2EA7F9'}}
                                              checked={this.state.vent3mois}
                                              onChange={this.handleChangeType}
                                              name="vent3mois"
                                          />
                                      }
                                      label="D'ici 3 mois"
                                  />
                              </FormGroup>
                              </Grid>
                              <Grid item xs={12} md={6} >  
                                                        <FormGroup row>
                                  <FormControlLabel
                                      control={
                                          <Checkbox iconStyle={{fill: '#2EA7F9'}}
                                              checked={this.state.plusde3mois}
                                              onChange={this.handleChangeType}
                                              name="plusde3mois"
                                          />
                                      }
                                      label="Dans plus de 3 mois"
                                  />
                              </FormGroup>
                              </Grid>
                                    <Grid item xs={12} md={6} >                            
                                    <FormGroup row>
                                  <FormControlLabel
                                      control={
                                          <Checkbox iconStyle={{fill: '#2EA7F9'}}
                                              checked={this.state.mettreLocation}
                                              onChange={this.handleChangeType}
                                              name="mettreLocation"
                                          />
                                      }
                                      label="Mise en location"
                                  />
                              </FormGroup>
                              </Grid>
                              <Grid item xs={12} md={6} >                            <FormGroup row>
                                  <FormControlLabel
                                      control={
                                          <Checkbox iconStyle={{fill: '#2EA7F9'}}
                                              checked={this.state.ventEtAchat}
                                              onChange={this.handleChangeType}
                                              name="ventEtAchat"
                                          />
                                      }
                                      label="Je viens de vendre"
                                  />
                              </FormGroup>
                              </Grid>                       
                                    <FormGroup row>
                                  <FormControlLabel
                                      control={
                                          <Checkbox iconStyle={{fill: '#2EA7F9'}}
                                              checked={this.state.pasdeProjet}
                                              onChange={this.handleChangeType}
                                              name="pasdeProjet"
                                          />
                                      }
                                      label="Pas de projet"
                                  />
                              </FormGroup>
                               </Grid>
                                <hr/>
                                
                                <h6 className="mt-2">Communes</h6>
                                <Autocomplete
                                    multiple
                                    className="mt-2 bg-gray-100"
                                    id="combo-box-demo"
                                    options={Communes}
                                    defaultValue={this.state.commune}
                                    autoComplete={true}
                                    autoHighlight={true}
                                    disablePortal={false}
                                    limitTags={1}
                                    noOptionsText = "Pas de résultat"
                                    getOptionLabel={(option) => option.name}
                                    // PaperComponent={({ children }) => (
                                    //   <h1 className="bg-gray-100">{children}</h1>
                                    // )}
                                    onChange={(event,newValue)=>{
                                      this.pushToCommuneState(newValue)
                                    }}
                                    renderInput={(params) => 
                                    <TextField 
                                        
                                        {...params} 
                                        value={this.state.commune}
                                        error={false}
                                        label="Communes"
                                        variant="outlined" 
                                    />}
                                  />
                              <button className="register-prev-button  mt-6  btn btn-primary prev-button"
                                    onClick={() => { this.SubmitFilter() }}
                                    > Submit</button>
                              </div>
                              
                          </div>
                            :
                            ""
                          }
                         

                        


                        </div>
                    
                </div>

      <div className="root-lead-container">
                            
          <div  className="flex justify-center mt-6 items-center flex-grow space-x-6 md:space-x-2">           
              <button className="register-prev-button btn btn-primary prev-button close-btn"
              onClick={() => { this.popup() }}
              > Filter</button>
              <button className="register-prev-button btn btn-primary prev-button close-btn"
              onClick={() => { this.all() }}
              > tous les projects</button>
          </div>
        {this.state.currentLeads
          .sort((a, b) =>(b.estimation.date>a.estimation.date) ? 1 : -1)
          .map((row,key) => {
            let surfaceeffective = 0
            if (row.estimation.bien === "villa"){
              surfaceeffective = row.estimation.surfaceterrain
            }
            else {
              if(row.estimation.parking) {
                surfaceeffective= row.estimation.surfacehabitable + (row.estimation.surfacecave+row.estimation.surfacebalcon+row.estimation.placesparking*12)/2
            }
            else {
                surfaceeffective= row.estimation.surfacehabitable + (row.estimation.surfacecave+row.estimation.surfacebalcon)/2 
            } 
          }
       let pricemetter = row.estimation.estimation/surfaceeffective
       return (
      <div className="container--content-dossiers">
      <Grid key ={row.estimation.estimationId} item xs = {12}>
      <Card>
          <Grid container spacing={2}>
      <Grid xs={12} md={4}>
      <EstimationMap viewport={{latitude :  parseFloat(`${row.estimation.localisation.split("lat : ")[1].split(" ")[0]}`),longitude : parseFloat(`${row.estimation.localisation.split("lng : ")[1]}`),zoom : 14}} classMarker = {"markerpoint markerpoint--folder"} />
      </Grid>


      <Grid xs={12} md={8}>

      <div className="content--container">
      {row.notify.includes(this.props.uid) ?(
            <div className="new--lead">

          <p className="new--lead"><i class="fas fa-medal"></i> 
          Nouveau Lead</p>


        </div>
            ) : ('') }

                     <div className="content--header">
                       <p className="header-text">{row.estimation.adresse}</p>
                       <p className="header-date">{this.formatDate(row.estimation.date)}</p>
                     </div>
                     <div className="content--details">
                       <p className="detail--text"><span className="bien">{row.estimation.bien==="villa" ? "Villa" : (row.estimation.bien==="appartement" ? "Appartement" : "Terrain nu") }</span>  - <span className="surface">{row.estimation.bien==="villa" ? `${row.estimation.surfaceterrain} m² de terrain` : (row.estimation.bien==="appartement" ? `${surfaceeffective} m²` : `${row.estimation.surfaceterrain} m² de terrain`) } </span></p>
                       </div>
                       <div className="content--etage">
                       <p className="etage--text">{row.estimation.bien==="villa" ?
                       (<span className="etage-empty"></span>) :
                        ((row.estimation.etage!=="") ?
                         (<span className="etage">
                            {row.estimation.etage ===0 ? ("Rez-de-chaussée") 
                            :
                             (row.estimation.etage ===1 ?
                                 ("1er étage") :
                                  (`${row.estimation.etage}ème étage`))} </span>) : (<span className="etage-empty"></span>))}
                                  </p>
                       </div>
                       {this.props.detailLinks ? (
                      <div className="projet--vente-container">
                        <p className="projet--vente">Projet de vente : {row.estimation.projet_vente}</p>
                      </div>)
                      :( "")}

                      <div className="content--bottom">
                        <div className="content-price content-price-estimation">
                        {this.props.detailLinks ? (
                          <>
                        <p className="price"><NumberFormat displayType={'text'} decimalScale={0} value={row.estimation.estimation} thousandSeparator={" "}/> MAD </p><span className="price-separator">{" "}</span><p className="price-m2"><NumberFormat decimalScale={0} displayType={'text'} value={pricemetter} thousandSeparator={" "}/> MAD/m²</p>
                        </>
                        ):("")}
                        </div>
  
                        <div className="content-detail-link-rapport">

                      </div>
                      </div>
                      {row.handled ?(
              row.handled.includes(this.props.uid) ? (
                        <div className="contact--container">
                          <div className="contact--left">
<p className="contact-name"><i class="far fa-user"></i>{row.estimation.firstName}{" "}{row.estimation.lastName}</p>
                            </div>
<div className="contact--right">
<p className="contact-lead-mail"> <i class="fas fa-at"></i> {row.estimation.email}</p>
<p className="contact-lead-phone"><i class="fas fa-phone-alt"></i> {row.estimation.telephone}</p>
                            </div>
                        </div>
              ) : ("")):("")}
                      <div className="content--bottom-actions">
                        <div className="content-delete">
                                                <button className="delete-lead-button"
onClick={() => {this.setState({openLeadDelete : true, leadToDelete : row.estimation.estimationId})}}>
{this.state.loading && this.state.action === 'delete' ? ( <Spinner animation="border" className = "text-white" size="sm"/>): <><DeleteForeverIcon/> </>}
                                                </button>

        </div>
                   
        <div className="content-detail-link">
                        {this.props.detailLinks ? (
                                this.state.expanded===key ?(
                                <i class="fas fa-chevron-up chevron-dropdown-estimation" onClick={() => this.handleExpandClose()}></i>) 
                                :
                                 (<i class="fas fa-chevron-down chevron-dropdown-estimation" onClick={() => this.handleExpandClick(key)}></i>)
                                 ):
                                 ("")}


                      </div>
                   
                      </div>
                      <div className="actions--container">
      {row.handled ? (
        row.handled.includes(this.props.uid) ? (
                                                        <>
                                            <button 
                                                   
                                                   type="button" 
                                                   className="button button-danger" disabled><i class="fas fa-phone-volume"></i>Projet en traitement</button> </>
                                                        ) 
                                                        :( 
                                                        
                                                        row.handled.length>2 ?
                                                         (<>   <button 
                                                   
                                                          type="button" 
                                                          className="button button-danger button--unavailable" disabled><i class="fas fa-user-alt-slash"></i>Ce lead a déjà été contacté par trois agences</button> </>)
                                                          : (
                                                            <>
                                                            <button 
                                                            type="button" 
                                                            className="button button-danger button--available"
                                                            onClick={() => {
                                                              this.setState({openMeetingModal : true});
                                                              row.handled = [this.props.uid]
                                                              this.meetLead(this.props.uid, row.estimation.estimationId)}}>
                                                                <i class="fas fa-user-plus"></i> Obtenir le contact
                                                                </button>
                                                                </>
                                                                )
                                                        )
        ) : (                                                            <>
          <button 
          type="button" 
          className="button button-danger button--available"
          onClick={() => {
            this.setState({openMeetingModal : true});
            row.handled = [this.props.uid]
            this.meetLead(this.props.uid, row.estimation.estimationId)}}>
              <i class="fas fa-user-plus"></i>Obtenir le contact
              </button>
              </>)
                                                        
                                                        }
      </div>
    
                   
                   </div>
                  

      </Grid>
    
      </Grid>
      

      <Collapse in={this.state.expanded===key} timeout="auto" unmountOnExit>
        <CardContent>
        <div className = "row">
                                                <div className = "col-md-6">
                                                    {row.estimation.address ? 
                                                    (<p className="details-bien"> <span className ="details-bien-title">Adresse :</span> {row.estimation.address}</p>)
                                                    : '' }

                                                    {row.estimation.agencement ? 
                                                    (<p className="details-bien"> <span className ="details-bien-title">Agencement : </span> 
                                                    {row.estimation.agencement === 1 ?
                                                    (
                                                        <div className="">
                                                            <img src={filledStar} alt=''></img>
                                                            <img src={filledNotStar} alt=''></img>
                                                            <img src={filledNotStar} alt=''></img>
                                                            <img src={filledNotStar} alt=''></img>
                                                        </div>
                                                    ): 
                                                    row.estimation.agencement === 2 ?
                                                        (
                                                            <div className="">
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledNotStar} alt=''></img>
                                                                <img src={filledNotStar} alt=''></img>
                                                            </div>
                                                        ):
                                                        row.estimation.agencement === 3 ?
                                                        (
                                                            <div className="">
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledNotStar} alt=''></img>
                                                            </div>
                                                        ):
                                                        row.estimation.agencement === 4 ?
                                                        (
                                                            <div className="">
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                            </div>
                                                        ): ''}
                                                    </p>)
                                                    : '' }
                                                    {row.estimation.ascenseur !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Ascenceur : </span> {row.estimation.ascenseur === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.balcon !== undefined ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Balcon : </span> {row.estimation.balcon === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.calme !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Calme : </span> {row.estimation.calme === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.cave !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Cave : </span> {row.estimation.cave === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }

                                                    {row.estimation.chambreservice !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Chambre de service : </span> {row.estimation.chambreservice === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.cheminee !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Cheminée : </span> {row.estimation.cheminee === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.concierge !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Concierge : </span> {row.estimation.concierge === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.construction ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Construction : </span> {
                                                        row.estimation.construction === -1 ?
                                                        ('Je ne sais pas') :
                                                        row.estimation.construction === 0 ?
                                                        ('Moins de 5 ans'):
                                                        row.estimation.construction === 1 ?
                                                        ('Entre 10 et 20 ans'):
                                                        row.estimation.construction === 2 ?
                                                        ('Plus de 20 ans'):
                                                        row.estimation.construction === 3 ?
                                                        ('Moins de 10 ans'):
                                                        ('Construction neuve')
                                                        }</p>)
                                                    : '' }
                                                    {row.estimation.dateTransactions ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Date de la transaction : </span> {row.estimation.dateTransactions}</p>)
                                                    : '' }
                                                    {row.estimation.duplex !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Duplex : </span> {row.estimation.duplex === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.etage !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Etage : </span>{ row.estimation.etage}</p>)
                                                    : '' }
                                                    {row.estimation.etagesimmeuble !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Etage immeuble : </span> {row.estimation.etagesimmeuble === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.finition ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Finition : </span> 
                                                    {row.estimation.finition === 'correct' ? ('Correct') :
                                                    row.estimation.finition === 'travauxaprevoir' ? ('Travaux à prévoir') :
                                                    row.estimation.finition === 'refaitaneuf' ? ('Refait à neuf') : ''
                                                    }</p>)
                                                    : '' }
                                                </div>

                                                <div className = "col-md-6">
                                                    
                                                    {row.estimation.luminosite ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Luminosité : </span> 
                                                    {row.estimation.luminosite === 1 ?
                                                    (
                                                        <div className="">
                                                            <img src={filledStar} alt=''></img>
                                                            <img src={filledNotStar} alt=''></img>
                                                            <img src={filledNotStar} alt=''></img>
                                                            <img src={filledNotStar} alt=''></img>
                                                        </div>
                                                    ): 
                                                    row.estimation.luminosite === 2 ?
                                                        (
                                                            <div className="">
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledNotStar} alt=''></img>
                                                                <img src={filledNotStar} alt=''></img>
                                                            </div>
                                                        ):
                                                        row.estimation.luminosite === 3 ?
                                                        (
                                                            <div className="">
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledNotStar} alt=''></img>
                                                            </div>
                                                        ):
                                                        row.estimation.luminosite === 4 ?
                                                        (
                                                            <div className="">
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                                <img src={filledStar} alt=''></img>
                                                            </div>
                                                        ): ''
                                                    }</p>)
                                                    : '' }
                                                    {row.estimation.orientation ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Orientation : </span> {row.estimation.orientation}</p>)
                                                    : '' }
                                                    {row.estimation.parking !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Parking : </span> {row.estimation.parking === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.placesparking !== undefined ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Place de parking : </span> {row.estimation.placesparking}</p>)
                                                    : '' }
                                                    {row.estimation.prix ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Prix : </span> 
                                                    { new Intl.NumberFormat(
                                                        'ma',
                                                        {
                                                            style: 'currency',
                                                            currency: 'MAD',
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0
                                                        })
                                                        .format(row.estimation.prix)
                                                        .replaceAll(',', ' ') } </p>)
                                                    : '' }
                                                    {row.estimation.redejardin !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Rez de jardin : </span> {row.estimation.redejardin === 'non' ? 'Non' : 'Oui collectif'}</p>)
                                                    : '' }
                                                    {row.estimation.renovee !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Rénovée : </span> {row.estimation.renovee === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.residencefermee !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Residence fermée : </span> {row.estimation.residencefermee === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                    {row.estimation.sdb !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Salles de bain : </span> {row.estimation.sdb}</p>)
                                                    : '' }
                                                    {row.estimation.surfacebalcon !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Surface du balcon : </span> {row.estimation.surfacebalcon}</p>)
                                                    : '' }
                                                    {row.estimation.surfacecave !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Surface de la cave : </span> {row.estimation.surfacecave} m²</p>)
                                                    : '' }
                                                    {row.estimation.surfacehabitable !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Surface habitable : </span> {row.estimation.surfacehabitable} m²</p>)
                                                    : '' }
                                                    {row.estimation.surfaceparking ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Surface du parking : </span> {row.estimation.surfaceparking} m²</p>)
                                                    : '' }
                                                    {row.estimation.typologie ? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Nombre de chambres : </span> {row.estimation.typologie}</p>)
                                                    : '' }
                                                    {row.estimation.vueexceptionnelle !== undefined? 
                                                    (<p className="details-bien"><span className ="details-bien-title"> Vue exceptionnelle : </span> {row.estimation.vueexceptionnelle === 1 ? 'Oui' : 'Non'}</p>)
                                                    : '' }
                                                </div>
                                            </div>
                                       
        </CardContent>
      </Collapse>
    </Card>

      </Grid>
      </div>
       )
                                                    })}  


</div>
                </ThemeProvider>
                <div className="d-flex flex-row py-4 align-items-center pagination--container">
              <Pagination totalRecords={totalLeads} pageNeighbours={1} onPageChanged={this.onPageChanged} pageLimit={5} />
</div>
            </div>
            ) ) : (
    <Loading />
            ) }
            </div>
            </>
            )
        }
      }
    
const mapStateToProps = (state) => {
  const estimation = state.espacePro;
  const uid = state.auth.uid;
  return {
      uid: uid,
      config: state.config,
      priceDetails: state.priceDetails,
      espacePro: estimation,
      estimations: state.espacePro.estimations,
      notifications: state.espacePro.notifications,
      searchedAddress: state.estimationState.urlViewport
  }
}; 

export default connect(mapStateToProps)(Dossiers)
