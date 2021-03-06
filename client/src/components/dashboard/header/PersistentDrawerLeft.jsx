import React from 'react';
import './PersistentDrawerLeft.css';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import ImageAvatars from '../../avatar/ImageAvatars';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAdd from '@material-ui/icons/PersonAdd';
import NewsAdd from '@material-ui/icons/LibraryAdd';
import PortfolioIcon from '@material-ui/icons/Person';
import PersonPin from '@material-ui/icons/PersonPin'
import API from '../../../utils/API';
import Auth from '../../../utils/Auth';
const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class PrimarySearchAppBar extends React.Component {
  _isMounted = false;
  state = {
    anchorEl: null,//topnavbar var
    mobileMoreAnchorEl: null,
    open: false ,
    
    // notifications: 0,//notifications
    // notificationList: [],

    myFile: null
  };


  componentDidUpdate() {
    this._isMounted = false;
    // this.manageSockets();
  }

  componentWillUpdate(){
    this._isMounted = true;
    
  }

  manageSockets = () => {
    console.log(this._isMounted);
      if((this.props.socketData === 'message')){
      let mynotifications = [];
      let newNotification = 0;
      API.getAct(this.props.token).then(result => {
        for (let i = 0; i < result.data.items.act; i++) {
          if(result.data.items.act[i].isView === false) newNotification++;
          mynotifications.push(result.data.items.act[i]);  
        }  
        this.setState({notifications: this.state.notifications + newNotification,
        notificationList: mynotifications})
      }).catch(err => console.log(err))
      
      }
  }


  handleProfileMenuOpen = event => {
    // API.updateAct(this.props.token, {});
    this.props.handleClickNotification();
    this.setState({ anchorEl: event.currentTarget});
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null});
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    API.updateAct(this.props.token, {});
    this.setState({ mobileMoreAnchorEl: event.currentTarget});
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };


  
  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
 

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
      {(this.props.notificationList).length > 0? 
      this.props.notificationList.map((e,i) => <MenuItem key={i} onClick={this.handleMenuClose}>{e.act}</MenuItem>):
      this.props.actList.map((e,i) => <MenuItem key={i} onClick={this.handleMenuClose}>{e.act}</MenuItem>)}
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit" onClick={this.handleProfileMenuOpen}>
          {console.log('nnnnn'+this.props.notifications)}
          {((this.props.notifications)&&(this.props.notifications !== 0))? 
              <Badge badgeContent={this.props.notifications} color="secondary"> 
                <NotificationsIcon />
              </Badge>:  <NotificationsIcon />
              }
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static"
         className={(this.props.open === false)?"appBar":"appBar appBarShift"}>
          <Toolbar disableGutters={!this.props.open}>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" onClick={this.props.handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            {'welcome ' + this.props.user.name}
            </Typography>

            <div className={classes.search}>
              <form className="searchForm_div" id="search-form" autoComplete="off" onSubmit={this.props.SearchOpration}>
                <div>
                  <div className='search-input'>
                    <input className="validate" type='text' name='search' id='search-private' placeholder="search..." value={this.props.searchVal} onChange={this.props.handleChange}/>
                  </div>
                </div>
              </form>
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit" onClick={this.handleProfileMenuOpen}>
              {((this.props.notifications)&&(this.props.notifications !== 0))? 
              <Badge badgeContent={this.props.notifications} color="secondary"> 
                <NotificationsIcon />
              </Badge>:  (this.props.viewPost !== 0)?
                <Badge badgeContent={this.props.viewPost} color="secondary"> 
                  <NotificationsIcon />
                </Badge>:
              <NotificationsIcon />
              }
              
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                color="inherit"
              >
              {this.props.avatar === ''?<AccountCircle />:
              <ImageAvatars avatar={this.props.user.avatar?
                String(window.location).includes('localhost')?
                  `http://localhost:3001/post/getImage/${this.props.user.avatar}`:
                  `https://final-mongo.herokuapp.com/post/getImage/${this.props.user.avatar}`
                :'https://ryanacademy.ie/wp-content/uploads/2017/04/user-placeholder.png'}/>}
                
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={this.props.open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div 
          className="drawerHeader"
          >
            <IconButton onClick={this.props.handleDrawerClose}>
              <ChevronLeftIcon /> 
            </IconButton>
          </div>
          <Divider />
          <List>
              <ListItem button key={'dashboard'} onClick={this.props.dashboardCLick}>
                <ListItemIcon><PersonPin /></ListItemIcon>
                <ListItemText primary={'dashboard'} />
              </ListItem>
              <ListItem button key={'portfolio'} onClick={this.props.portfolioCLick}>
                <ListItemIcon><PortfolioIcon /></ListItemIcon>
                <ListItemText primary={'portfolio'} />
              </ListItem>

              <ListItem button key={'add News'} onClick={this.props.addNewsCLick}>
                <ListItemIcon><NewsAdd /></ListItemIcon>
                <ListItemText primary={'add News'} />
              </ListItem>
               
          </List>
          <Divider />
          {this.props.user.access === 1 ?
          <List>
            <ListItem button key={'Add employee'} onClick={this.props.addEmployeeCLick}>
                <ListItemIcon><PersonAdd /></ListItemIcon>
                <ListItemText primary={'add employee'} />
            </ListItem>
          </List>: null}
        </Drawer>
        
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);