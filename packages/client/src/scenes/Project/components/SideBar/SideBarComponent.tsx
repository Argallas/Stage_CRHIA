import { AnnotationRecord, ProjectGraphRecord, UserRecord } from "@celluloid/types";
import {
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ButtonProgress from "components/ButtonProgress";
import DialogError from "components/DialogError";
import LabeledProgressSwitch from "components/LabeledProgressSwitch";
import UserAvatar from "components/UserAvatar";
import VisibilityChip from "components/VisibilityChip";
import * as React from "react";
import { AsyncAction } from "types/ActionTypes";
import { isOwner, isAdmin } from "utils/ProjectUtils";
import CSVAnnotationExport from './components/CSVAnnotationExport';
import XMLAnnotationExport from './components/XMLAnnotationExport';
import ShareCredentials from "components/ShareCredentials";

import ShareDialog from "./components/ShareDialog";
import { useTranslation } from "react-i18next";

const styles = ({ spacing }: Theme) =>
  createStyles({
    button: {
      padding: spacing.unit,
      paddingBottom: 0,
    },
    paper: {
      marginTop: 0,
      margin: spacing.unit,
      padding: spacing.unit,
    },
    list: {
      padding: 0,
      paddingBottom: spacing.unit * 2,
    },
    listItem: {
      padding: 0,
    },
    listHeader: {
      height: spacing.unit * 5,
      textAlign: "left",
      marginTop: spacing.unit,
      paddingLeft: spacing.unit,
    },
    buttonIcon: {
      marginRight: spacing.unit * 2,
    },
    chips: {
      paddingTop: spacing.unit,
      textAlign: "right",
    },
  });

export interface Member extends UserRecord {
  subtitle?: string;
}

interface Props extends WithStyles<typeof styles> {
  user?: UserRecord;
  project: ProjectGraphRecord;
  members: Set<Member>;
  setPublicLoading: boolean;
  setCollaborativeLoading: boolean;
  unshareLoading: boolean;
  deleteLoading: boolean;
  setPublicError?: string;
  setCollaborativeError?: string;
  unshareError?: string;
  deleteError?: string;
  performance_mode: boolean;
  sequencing: boolean;
  annotations: AnnotationRecord[];
  onClickSetPublic(
    projectId: string,
    value: boolean
  ): AsyncAction<ProjectGraphRecord, string>;
  onClickSetCollaborative(
    projectId: string,
    value: boolean
  ): AsyncAction<ProjectGraphRecord, string>;
  onClickShare(): void;
  onClickDelete(projectId: string): AsyncAction<null, string>;
  onClickSwitchPlayerMode(): void;
  onClickSwitchSequencing(): void;
}

const SideBarComponenent: React.FC<Props> = ({
  user,
  project,
  members,
  setCollaborativeLoading,
  setPublicLoading,
  unshareLoading,
  deleteLoading,
  setPublicError,
  setCollaborativeError,
  unshareError,
  deleteError,
  performance_mode,
  sequencing,
  annotations,
  onClickSetPublic,
  onClickSetCollaborative,
  onClickShare,
  onClickDelete,
  onClickSwitchSequencing,
  onClickSwitchPlayerMode,

  classes,
}: Props) => {
  const { t } = useTranslation();
   console.log(' dans sidebar les annotations:', annotations[0])
  return (
    <>
      {user && isOwner(project, user) ? (
        <>
          <LabeledProgressSwitch
            label={t("project.public")}
            checked={project.public}
            loading={setPublicLoading}
            error={setPublicError}
            onChange={() => onClickSetPublic(project.id, !project.public)}
          />
          <LabeledProgressSwitch
            label={t("project.collaborative")}
            checked={project.collaborative}
            loading={setCollaborativeLoading}
            error={setCollaborativeError}
            onChange={() =>
              onClickSetCollaborative(project.id, !project.collaborative)
            }
          />
             {user &&
                <LabeledProgressSwitch
                  label={t('project.sequencing')}
                  checked={sequencing}
                  loading={false}
                  onChange={() => {
                    onClickSwitchSequencing();
                    if (performance_mode === true) {
                      onClickSwitchPlayerMode();
                    }
                  }
                  }
                />
              }
              <LabeledProgressSwitch
                label={t('project.analyze')}
                checked={!performance_mode}
                loading={false}
                onChange={() => {
                  if (performance_mode === false && sequencing === true) {
                    onClickSwitchSequencing();
                  }
                  onClickSwitchPlayerMode();
                }
                  
                }
              />
              <LabeledProgressSwitch
                label={t('project.performance')}
                checked={performance_mode}
                loading={false}
                onChange={() => {
                  onClickSwitchPlayerMode();
                  if (sequencing === true) {
                    onClickSwitchSequencing();
                  }
                }
                }
              />
        </>
      ) : (
        <div className={classes.chips}>
          <VisibilityChip
            show={project.public}
            label={t("project.public").toLowerCase()}
          />
          <VisibilityChip
            show={project.collaborative}
            label={t("project.collaborative").toLowerCase()}
          />
        </div>
      )}
      {user && isOwner(project, user) && (
        <>
          <LabeledProgressSwitch
            label={t("project.shared")}
            checked={project.shared}
            loading={unshareLoading}
            error={unshareError}
            onChange={() => onClickShare()}
          />
          <ShareDialog project={project} />
          {project.shared && (
            <div className={classes.chips}>
              <ShareCredentials
                name={project.shareName}
                password={project.sharePassword}
              />
              {t("project.share.dialog.description")}
              <a
                href={`/shares/${project.id}?p=${project.sharePassword}`}
                target="_blank"
                rel="noreferrer"
              >
                {t("project.share.dialog.linkText")}
              </a>
              .
            </div>
          )}
        </>
      )}
       <div className={classes.chips}>
       <XMLAnnotationExport
          annotations={annotations}
          project={project}
          buttonName={t('project.exportButton')}
        />
          <CSVAnnotationExport
            annotations={annotations}
            project={project}
            buttonName={t('project.exportButton')}
          />
      </div>
      {/*{((user && !isOwner(project, user)) && (user && !isMember(project, user))
      && (user && !isAdmin(user)) && project.shared) &&
        <div className={classes.button}>
          <ButtonProgress
            variant="contained"
            color="primary"
            size="small"
            fullWidth={true}
            loading={unshareLoading}
            onClick={onClickShare}
          >
            {`rejoindre`}
          </ButtonProgress>
        </div>
      } */}
      {user && isOwner(project, user) && (
        <List
          dense={true}
          className={classes.list}
          subheader={
            <ListSubheader className={classes.listHeader}>
              {t("project.members", { count: members.size })}
            </ListSubheader>
          }
        >
          {Array.from(members).map((member: Member) => (
            <ListItem key={member.id} className={classes.listItem}>
              {/* @ts-ignore */}
              <ListItemAvatar>
                <UserAvatar user={member} />
              </ListItemAvatar>
              <ListItemText
                primary={member.username}
                secondary={member.subtitle}
              />
            </ListItem>
          ))}
        </List>
      )}

      {user && isAdmin(user) && (
        <List
          dense={true}
          className={classes.list}
          subheader={
            <ListSubheader className={classes.listHeader}>
              {t("project.members", { count: members.size })}
            </ListSubheader>
          }
        >
          {Array.from(members).map((member: Member) => (
            <ListItem key={member.id} className={classes.listItem}>
              {/* @ts-ignore */}
              <ListItemAvatar>
                <UserAvatar user={member} />
              </ListItemAvatar>
              <ListItemText
                primary={member.username}
                secondary={member.subtitle}
              />
              <ListItemText primary={member.email} />
            </ListItem>
          ))}
        </List>
      )}

      {((user && isOwner(project, user)) || (user && isAdmin(user))) && (
        <div className={classes.button}>
          <ButtonProgress
            variant="contained"
            color="secondary"
            size="small"
            fullWidth={true}
            loading={deleteLoading}
            onClick={() => onClickDelete(project.id)}
          >
            <DeleteIcon fontSize="inherit" className={classes.buttonIcon} />
            {t("deleteAction")}
          </ButtonProgress>
          {deleteError && <DialogError error={deleteError} />}
        </div>
      )}
    </>
  );
};

export default withStyles(styles)(SideBarComponenent);
