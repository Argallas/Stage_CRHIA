import "rc-slider/assets/index.css";

import { createProjectThunk } from "actions/ProjectActions";
import { createTagThunk } from "actions/TagActions";
import DialogError from "components/DialogError";
import DialogHeader from "components/DialogHeader";
import { Action, AsyncAction, EmptyAction } from "types/ActionTypes";
import {
  sliderHandleStyle,
  sliderRailStyle,
  sliderTrackStyle,
} from "utils/SliderUtils";
import {
  ProjectCreateData,
  ProjectGraphRecord,
  TagData,
  UserRecord,
} from "@celluloid/types";
import {
  Avatar,
  Button,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { discardNewVideo } from "actions/HomeActions";
import TagSearchBox from "components/TagSearchBox/TagSearchBox";
import * as R from "ramda";
import { Range } from "rc-slider";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { levelLabel, levelsCount } from "types/LevelTypes";
import { AppState } from "types/StateTypes";
import { PeertubeVideoInfo } from "types/YoutubeTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const styles = ({ spacing }: Theme) =>
  createStyles({
    tagList: {
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      marginTop: spacing.unit * 2,
      marginBottom: spacing.unit * 2,
    },
    levels: {
      paddingTop: spacing.unit * 4,
      width: "100%",
      display: "flex",
      flexDirection: "row",
    },
    levelSlider: {
      flexGrow: 1,
      paddingTop: 20,
    },
    levelLabel: {
      fontWeight: "bold",
      width: spacing.unit * 12,
    },
    assignmentInput: {
      marginRight: spacing.unit * 2,
    },
    content: {
      padding: spacing.unit * 2,
      margin: spacing.unit,
    },
    sectionTitle: {
      paddingTop: spacing.unit * 4,
    },
    image: {
      position: "relative",
      width: "100%",
      height: 320,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
    videoTitleWrapper: {
      position: "absolute",
      padding: `${spacing.unit}px ${spacing.unit * 3}px`,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      bottom: 0,
      right: 0,
      left: 0,
    },
    videoTitle: {
      color: "white",
      fontWeight: 500,
    },
    switchLabel: {
      paddingTop: spacing.unit * 1.5,
    },
  });

interface Props extends WithStyles<typeof styles> {
  video?: PeertubeVideoInfo;
  tags: TagData[];
  loading: boolean;
  error?: string;
  user?: UserRecord;
  onSubmit(project: ProjectCreateData): AsyncAction<ProjectGraphRecord, string>;
  onCancel(): EmptyAction;
  onNewTag(name: string): AsyncAction<TagData, string>;
}

const mapStateToProps = (state: AppState) => ({
  video: state.home.video,
  tags: state.tags,
  loading: state.home.createProjectLoading,
  error: state.home.errors.createProject,
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCancel: () => dispatch(discardNewVideo()),
  onSubmit: (project: ProjectCreateData) =>
    createProjectThunk(project)(dispatch),
  onNewTag: (name: string) => createTagThunk(name)(dispatch),
});

interface State {
  project: ProjectCreateData;
  nextAssignment: string;
}

function tagCreationSucceeded(
  result: Action<string | TagData>
): result is Action<TagData> {
  return !result.error;
}

const NewProjectContainer: React.FC<Props> = ({
  classes,
  video,
  tags,
  loading,
  error,
  user,
  onSubmit,
  onCancel,
  onNewTag,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    project: {
      video: {
        title: '',
        player: 'peertube.fr',
        path: ''
      },
      videoId: "",
      title: "",
      description: "",
      objective: "",
      assignments: [],
      levelStart: 0,
      levelEnd: levelsCount - 1,
      public: false,
      collaborative: false,
      host: "",
      tags: [],
    },
    nextAssignment: "",
  });

  const { project, nextAssignment } = state;

  const setProject = (modified: Partial<ProjectCreateData>) => {
    setState({
      ...state,
      // @ts-ignore
      project: {
        ...state.project,
        ...modified,
      },
    });
  };

  const featuredTags = R.filter((elem: TagData) => elem.featured)(tags);

  const displayedTags = R.union(featuredTags, project.tags);

  const isTagSelected = (tag: TagData) =>
    R.find((elem: TagData) => R.equals(elem, tag))(project.tags);

  const removeTag = (tag: TagData) =>
    R.filter((elem: TagData) => !R.equals(elem, tag))(project.tags);

  const onTagSelected = (tag: TagData) => {
    setProject({
      tags: isTagSelected(tag) ? removeTag(tag) : [...project.tags, tag],
    });
  };

  const onTagCreationRequested = (name: string) => {
    onNewTag(name).then((result) => {
      if (tagCreationSucceeded(result)) {
        onTagSelected(result.payload);
      }
    });
  };

  const handleSubmit = async (project: ProjectCreateData)=>{
    const {error, payload} = await onSubmit(project);
    if(!error){
      navigate(`/projects/${(payload as ProjectGraphRecord).id}`);
    }
    

  }
  if (video && user && user.role !== "Student") {
    return (
      <Dialog
        open={true}
        fullWidth={true}
        onClose={() => onCancel()}
        scroll="body"
      >
        <DialogHeader
          title={t("project.createTitle")}
          onClose={() => onCancel()}
          loading={loading}
        >
          <div
            className={classes.image}
            style={{
              backgroundImage: `url(${video.thumbnailUrl})`,
            }}
          >
            <div className={classes.videoTitleWrapper}>
              <Typography
                variant="h5"
                gutterBottom={true}
                className={classes.videoTitle}
              >
                {video.title}
              </Typography>
            </div>
          </div>
        </DialogHeader>
        <DialogContent className={classes.content}>
          <TextField
            margin="normal"
            required={true}
            label={t("project.title")}
            fullWidth={true}
            helperText={t("project.titleHelper")}
            onChange={(event) => {
              setProject({
                title: event.target.value,
              });
            }}
            value={project.title}
          />
          <TextField
            margin="normal"
            label={t("project.description")}
            fullWidth={true}
            helperText={t("project.descriptionHelper")}
            multiline={true}
            onChange={(event) => {
              setProject({
                description: event.target.value,
              });
            }}
            value={project.description}
          />
          <TextField
            margin="normal"
            required={true}
            label={t("project.objective")}
            fullWidth={true}
            helperText={t("project.objectiveHelper")}
            multiline={true}
            onChange={(event) => {
              setProject({
                objective: event.target.value,
              });
            }}
            value={project.objective}
          />
          <Typography
            variant="h6"
            className={classes.sectionTitle}
            gutterBottom={true}
          >
            {t("project.assignmentsSection")}
          </Typography>
          <Typography variant="subtitle1">
            {t("project.assignmentsHelper")}
          </Typography>
          <List>
            {project.assignments.map((assignment, index) => (
              <ListItem key={index}>
                {/* @ts-ignore */}
                <ListItemAvatar>
                  <Avatar>{index + 1}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={assignment} />
                {/* @ts-ignore */}
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      project.assignments.splice(index, 1);
                      setProject({
                        assignments: project.assignments,
                      });
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <ListItem>
              {/* @ts-ignore */}
              <ListItemAvatar>
                <Avatar>{project.assignments.length + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText
                className={classes.assignmentInput}
                primary={
                  <TextField
                    variant="outlined"
                    placeholder={t("project.assignmentPlaceholder")}
                    fullWidth={true}
                    value={nextAssignment}
                    onChange={(event) => {
                      setState({
                        ...state,
                        nextAssignment: event.target.value,
                      });
                    }}
                  />
                }
              />
              {/* @ts-ignore */}
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => {
                    setState({
                      ...state,
                      project: {
                        ...state.project,
                        assignments: [
                          // @ts-ignore
                          ...project.assignments,
                          // @ts-ignore
                          nextAssignment,
                        ],
                      },
                      nextAssignment: "",
                    });
                  }}
                >
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <Typography
            variant="h6"
            className={classes.sectionTitle}
            gutterBottom={true}
          >
            {t("project.tagsSection")}
          </Typography>
          <Typography variant="subtitle1">{t("project.tagsHelper")}</Typography>
          <div className={classes.tagList}>
            {displayedTags.map((tag) => (
              <Chip
                onClick={() => onTagSelected(tag)}
                onDelete={
                  isTagSelected(tag) ? () => onTagSelected(tag) : undefined
                }
                key={tag.id}
                label={tag.name}
                style={{
                  margin: 4,
                }}
              />
            ))}
          </div>
          <TagSearchBox
            onTagSelected={onTagSelected}
            onTagCreationRequested={onTagCreationRequested}
            label={t("project.tagsPlaceholder")}
          />
          <Typography
            variant="h6"
            className={classes.sectionTitle}
            gutterBottom={true}
          >
            {t("project.levelsSection")}
          </Typography>
          <Typography variant="subtitle1">
            {t("project.levelsHelper")}
          </Typography>
          <div className={classes.levels}>
            <Typography align="left" className={classes.levelLabel}>
              {t(levelLabel(project.levelStart))}
            </Typography>
            <div className={classes.levelSlider}>
              <Range
                min={0}
                max={levelsCount - 1}
                value={[project.levelStart, project.levelEnd]}
                onChange={(values) => {
                  setProject({
                    levelStart: values[0],
                    levelEnd: values[1],
                  });
                }}
                trackStyle={sliderTrackStyle}
                railStyle={sliderRailStyle}
                handleStyle={[sliderHandleStyle, sliderHandleStyle]}
                allowCross={false}
              />
            </div>
            <Typography align="right" className={classes.levelLabel}>
              {t(levelLabel(project.levelEnd))}
            </Typography>
          </div>
          <Typography
            variant="h6"
            className={classes.sectionTitle}
            gutterBottom={true}
          >
            {t("project.visibilitySection")}
          </Typography>
          <Grid container={true} direction="row" alignItems="flex-start">
            <Grid item={true} xs={2}>
              <Typography
                variant="subtitle1"
                align="right"
                className={classes.switchLabel}
              >
                {t("project.public")}
              </Typography>
            </Grid>
            <Grid item={true} xs={2}>
              <Switch
                checked={project.public}
                onChange={(_, value) => {
                  setProject({
                    public: value,
                  });
                }}
              />
            </Grid>
            <Grid item={true} xs={8}>
              <Typography gutterBottom={true} className={classes.switchLabel}>
                {t("project.publicHelper")}
              </Typography>
            </Grid>
          </Grid>
          <Grid container={true} direction="row" alignItems="flex-start">
            <Grid item={true} xs={2}>
              <Typography
                variant="subtitle1"
                align="right"
                className={classes.switchLabel}
              >
                {t("project.collaborative")}
              </Typography>
            </Grid>
            <Grid item={true} xs={2}>
              <Switch
                checked={project.collaborative}
                onChange={(_, value) => {
                  setProject({
                    collaborative: value,
                  });
                }}
              />
            </Grid>
            <Grid item={true} xs={8}>
              <Typography gutterBottom={true} className={classes.switchLabel}>
                {t("project.collaborativeHelper")}
              </Typography>
            </Grid>
          </Grid>
          {error && <DialogError error={error} />}
        </DialogContent>
        {loading && <LinearProgress variant="query" />}
        <DialogActions style={{ textAlign: "center" }}>
          <Button
            onClick={() => onCancel()}
            color="secondary"
            variant="contained"
          >
            {t("project.cancelAction")}
          </Button>
          <Button
            onClick={() =>
              handleSubmit({ ...project, videoId: video.id, host: video.host })
            }
            color="primary"
            variant="contained"
          >
            {t("project.createAction")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  } else {
    return <div />;
  }
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(NewProjectContainer)
);
