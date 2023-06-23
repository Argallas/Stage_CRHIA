import "rc-slider/assets/index.css";
import getFirstConcepts,{getSubConcepts, getRelation} from '../../api/Concept';
import addAnnotation from '../../api/Annotation';
import {
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  IconButton,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Clear";
import { Range } from "rc-slider";
import React, {useState} from "react";
import { formatDuration } from "utils/DurationUtils";
import { userName, userId } from './AnnotationEditorContainer';
import TransparentInput from "../TransparentInput";
import { sliderRailStyle, sliderTrackStyle } from "utils/SliderUtils";
import { useTranslation } from "react-i18next";




//import styled from 'styled-components';






const caretStart = require("images/caret-start.png");
const caretStop = require("images/caret-stop.png");

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    content: {
      flex: "1 1 auto",
      minWidth: 0,
      padding: `0 ${theme.spacing.unit * 2}px`,
      "&:first-child": {
        paddingLeft: 0,
      },
      margin: 10,
    },
    centerVerticalement: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    timeline: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    buttonRoot: {
      fontSize: 10,
      lineHeight: "20px",
      minWidth: 20,
      minHeight: 20,
      maxWidth: 20,
      maxHeight: 20,
      margin: 4,
      marginBottom: 7,
      padding: 0,
      borderRadius: "50%",
    },
  });
  const CSS = `
  #custom-select {
    position: relative;
    max-width: 30 px; 
    font-family:"sans-serif"
    font-size: 20px;
    color:#CECECE;
    font-weight: bold;
    width: 30px
    display: inline;
    padding-left 10px; 
    padding-right:20px;
  }
  option{
    background-color: #CECECE;
 
  }


  `;

interface Props extends WithStyles<typeof styles> {
  startTime: number;
  stopTime: number;
  pause: boolean;
  projectId: string;
  text: string;
  duration: number;
  error?: string;
  ontology?: string[];
  onTextChange(text: string): void;
  onCheckPauseChange(value: boolean): void;
  onTimingChange(value: number, isStart: boolean, seekAhead: boolean): void;
  onClickSave(): void;
  onClickCancel(): void;
}

interface TimingButtonProps extends WithStyles<typeof styles> {
  forward: boolean;
  onSeek(): void;
}

interface TimingControlProps extends WithStyles<typeof styles> {
  position: number;
  onBack(): void;
  onForward(): void;
}

const TimingButton = (props: TimingButtonProps) => (
  <Button
    classes={{ root: props.classes.buttonRoot }}
    size="small"
    onClick={() => {
      props.onSeek();
    }}
  >   
    {!props.forward ? `◀` : `▶`}
  </Button>
);

const TimingControl = (props: TimingControlProps) => (
  <>
    <TimingButton
      forward={false}
      onSeek={props.onBack}
      classes={props.classes}
    />
    <Typography variant="caption">{formatDuration(props.position)}</Typography>
    <TimingButton
      forward={true}
      onSeek={props.onForward}
      classes={props.classes}
    />
  </>
);
const emojis = [
  {
    label: 'Emotions & Judgements',
    value: '',
  },
  {
    label: '😀',
    value: '😀',
  },
  {
    label: '😂',
    value: 'Laugh',
  },
  {
    label: '🤣',
    value: 'Hilarity',
  },
  {
    label: '😠',
    value: 'Tiredness',
  },
  {
    label: '🙂',
    value: 'iLike',
  },
  {
    label: '🤯',
    value: 'Annoyance',
  },
  {
    label: '🥰',
    value: 'Empathy',
  },
  {
    label: '😍',
    value: 'iLove',
  },
  {
    label: '😨',
    value: 'Fear',
  },
  {
    label: '🙁',
    value: 'iDontLike',
  },
  {
    label: '🤔',
    value: 'ItsStrange',
  },
];



//const emojitypes = ['😀','🙁', '😂', '😍', '🤔'];


  

//export default teste;










 




export let globalEmoji=''
let globalConcept='concept'
let firstConcept=globalConcept
let secondConcept='concept'
let thirdConcept='concept'
let fourthConcept='concept'
let fiveConcept='concept'
let sixConcept='concept'
const options = getFirstConcepts(globalConcept);


class App extends React.Component <{perf: boolean}, {emoji: string, concept: string, concept1: string, concept2: string,concept3: string,concept4: string,concept5: string,concept6: string, option1:any, option2:any ,option3:any ,option4:any, option5: any, option6: any}> {
  constructor(props: any) {
    super(props);
   
    this.state = {
     
      concept: globalConcept,
      concept1:'concept 2',
      concept2:'concept 3',
      concept3:'concept 4',
      concept4:fourthConcept,
      concept5:fiveConcept,
      concept6:sixConcept,
      emoji:'Emoji',
      option1:[],
      option2:[],
      option3:[],
      option4:[],
      option5:[],
      option6:[],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    this.handleChange5 = this.handleChange5.bind(this);
    this.handleChange6 = this.handleChange6.bind(this);
    this.handleEmoji = this.handleEmoji.bind(this);
  }
handleChange(e:any) {
    this.setState({ concept: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option1:conc1})
    globalConcept=e.target.value;
    firstConcept=e.target.value;
    secondConcept=e.target.value;
    thirdConcept=e.target.value;
    fourthConcept=e.target.value;
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    console.log(' button 1',globalConcept)
  }
handleChange1(e:any) {
    this.setState({ concept1: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option2:conc1})
    secondConcept=e.target.value;
    thirdConcept=e.target.value;
    fourthConcept=e.target.value;
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 2',globalConcept)
  }
  handleChange2(e:any) {
    this.setState({ concept2: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option3:conc1})
    thirdConcept=e.target.value;
    fourthConcept=e.target.value;
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 3',globalConcept)
  }
  handleChange3(e:any) {
    this.setState({ concept3: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option4:conc1})
    fourthConcept=e.target.value;
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 4',globalConcept)
  }
  handleChange4(e:any) {
    this.setState({ concept4: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option5:conc1})
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 5',globalConcept)
  }
  handleChange5(e:any) {
    this.setState({ concept5: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option6:conc1})
  //  fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 6',globalConcept)
  }
  handleChange6(e:any) {
    this.setState({ concept6: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option6:conc1})
   // fiveConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 6',globalConcept)
  }
  handleEmoji(e:any) {
    this.setState({ emoji: e.target.value });
    globalEmoji=e.target.value;
  }

  render() { 
    console.log('mode performance ', this.props.perf)
    return (
      <div id="App">
       
        <div id="custom-select">
        <style>{CSS}</style>
      {!this.props.perf ? (
        <>
          <select value={this.state.concept} onChange={this.handleChange}>
            {options.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          {/* <select value={this.state.concept1} onChange={this.handleChange1}>
            {this.state.option1.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept2} onChange={this.handleChange2}>
            {this.state.option2.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept3} onChange={this.handleChange3}>
            {this.state.option3.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept4} onChange={this.handleChange4}>
            {this.state.option4.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept5} onChange={this.handleChange5}>
            {this.state.option5.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept6} onChange={this.handleChange6}>
            {this.state.option6.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select> */}
        </>
      ) : (
        <></>
      )}
      
          
          <select value={this.state.emoji} onChange={this.handleEmoji}>
            {emojis.map((emoji) => (
              <option value={emoji.value}>{emoji.label}</option>
            ))}
          </select> 
          </div>
      </div>
        
    );
  }
}

function PostAnnotation(startTime: number, stopTime: number, text: String,projectId: string,annotationId: any) {
  const relation=getRelation(firstConcept)
  console.log(' les 3 derniers concept',fourthConcept,sixConcept, fiveConcept,globalConcept)
 
  const annotationData= {
    projectId:projectId,
    userId:userId,
    commentaire:text,
    stopTime:stopTime,
    startTime: startTime,
   
    objet: [firstConcept,secondConcept,thirdConcept,fourthConcept, fiveConcept,sixConcept,globalConcept],
    userName:userName,
    relation:relation,
    annotationId:annotationId
  }
  if(firstConcept!=='Annotation Libre'){
  
    addAnnotation(annotationData)
  }
  
}
const AnnotationEditorComponent: React.FC<Props> = ({
  startTime,
  stopTime,
  pause,
  text,
  duration,
  error,
  projectId,
  onCheckPauseChange,
  onTimingChange,
  onTextChange,
  onClickSave,
  onClickCancel,
  classes,
}: Props) => {
  const { t } = useTranslation();

  const handleStyles = {
    border: 0,
    borderRadius: 0,
    backgroundColor: "rgba(0, 0, 0, 0)",
    backgroundSize: "cover",
    width: 12,
    height: 12,
  };


  const Teste = () => {
    const [selectedEmoji, setSelectedEmoji] = useState('');
  
    const handleButtonClick = (emoji : string) => {
      setSelectedEmoji(emoji);
    };
  
    const createButton = (emoji : string ) => {
      return (
        <button
          key={emoji}
          onClick={() => handleButtonClick(emoji)}
          style={{ marginRight: '45px' }}
        >
          {emoji}
        </button>
      );
    };
    return (
      <div className="Teste">
        {createButton('😀')}
        {createButton('🙁')}
        {createButton('😂')}
        {createButton('😍')}
        {createButton('🤔')}
        <h3>Emoji selectionné par l'utilisateur: {selectedEmoji}</h3>
      </div>
    );
  };



  return (
    <div className={classes.root}>
      <div className={classes.content}>
      <div className={classes.centerVerticalement}>
            <App
              perf={false}
            />
            </div>
         <>
            <TransparentInput
              text={text}
              error={error}
              onChange={onTextChange}
              placeholder={t("annotation.contentPlaceholder")}
            />
         </>
     
         <Teste/>


        <div className={classes.timeline}>
          <TimingControl
            onBack={() =>
              onTimingChange(Math.max(0, startTime - 1), true, true)
            }
            onForward={() =>
              onTimingChange(Math.min(stopTime, startTime + 1), true, true)
            }
            position={startTime}
            classes={classes}
          />
          <div style={{ padding: 8, flexGrow: 1 }}>
            <Range
              min={0}
              max={duration}
              value={[startTime, stopTime]}
              onChange={(values) => {
                if (startTime !== values[0]) {
                  onTimingChange(values[0], true, false);
                } else if (stopTime !== values[1]) {
                  onTimingChange(values[1], false, false);
                }
              }}
              onAfterChange={(values) => {
                if (startTime !== values[0]) {
                  onTimingChange(values[0], true, true);
                } else if (stopTime !== values[1]) {
                  onTimingChange(values[1], false, true);
                }
              }}
              trackStyle={sliderTrackStyle}
              railStyle={sliderRailStyle}
              handleStyle={[
                {
                  ...handleStyles,
                  marginTop: -11,
                  marginLeft: -5,
                  backgroundImage: `url(${caretStart})`,
                },
                {
                  ...handleStyles,
                  marginTop: 3,
                  marginLeft: -6,
                  backgroundImage: `url(${caretStop})`,
                },
              ]}
              allowCross={false}
            />
          </div>
          <TimingControl
            onBack={() =>
              onTimingChange(Math.max(startTime, stopTime - 1), false, true)
            }
            onForward={() =>
              onTimingChange(Math.min(stopTime + 1, duration), false, true)
            }
            position={stopTime}
            classes={classes}
          />
        </div>
        
       

        <div className={classes.buttons}>
          <FormControlLabel
            control={
              <Checkbox
                checked={pause}
                onChange={(event) => onCheckPauseChange(event.target.checked)}
              />
            }
            label={t("annotation.pauseLabel")}
          />
          <IconButton color="secondary" onClick={() => onClickCancel()}>
            <CancelIcon />
          </IconButton>
          <IconButton color="primary" 
          // onClick={() => onClickSave()}
              onClick={async ()  =>
                  { 
                    const annotationId= await onClickSave() 
                    PostAnnotation(startTime, stopTime, text,projectId,annotationId);
                    globalEmoji=''
                  }
                          }>
            <CheckIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(AnnotationEditorComponent);
