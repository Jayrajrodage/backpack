import { useEffect, useState } from "react";
import { Box, List, ListItem, ListItemIcon } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ChatIcon from "@mui/icons-material/Chat";
import WebIcon from "@mui/icons-material/Web";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { styles } from "@coral-xyz/themes";
import { useBackgroundClient } from "@coral-xyz/recoil";
import {
  UI_RPC_METHOD_KEYRING_EXPORT_SECRET_KEY,
  UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET,
} from "@coral-xyz/common";
import { CopyButton } from "../../Account/MnemonicInput";
import {
  DangerButton,
  Header,
  HeaderIcon,
  SecondaryButton,
  SubtextParagraph,
  TextField,
} from "../../common";
import { EyeIcon, WarningIcon } from "../../common/Icon";
import { useNavStack } from "../../Layout/NavStack";
import { useDrawerContext } from "../../Layout/Drawer";

const useStyles = styles((theme: any) => ({
  passwordField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: `solid 2pt ${theme.custom.colors.border}`,
      },
      "&:hover fieldset": {
        border: `solid 2pt ${theme.custom.colors.primaryButton}`,
      },
    },
  },
  privateKeyField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: `solid 1pt ${theme.custom.colors.border}`,
      },
      "&:hover fieldset": {
        border: `solid 1pt ${theme.custom.colors.border}`,
      },
      "&.Mui-focused fieldset": {
        border: `solid 1pt ${theme.custom.colors.border} !important`,
      },
    },
  },
  mnemonicInputRoot: {
    color: theme.custom.colors.secondary,
    borderRadius: "8px",
    marginTop: "4px",
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.custom.colors.nav,
      borderRadius: "8px",
      height: "40px",
      "& fieldset": {
        border: "none",
      },
    },
    "& .MuiInputBase-input": {
      color: theme.custom.colors.fontColor,
      backgroundColor: theme.custom.colors.nav,
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 700,
    },
    "& .MuiInputAdornment-root": {
      color: theme.custom.colors.secondary,
      fontWeight: 500,
    },
  },
  listRoot: {
    color: theme.custom.colors.fontColor,
    padding: "0",
    margin: "0 8px",
    borderRadius: "4px",
    fontSize: "14px",
  },
  listItemRoot: {
    alignItems: "start",
    borderBottom: `1px solid #000`,
    borderRadius: "4px",
    background: theme.custom.colors.nav,
    padding: "8px",
    height: "56px",
  },
  listItemIconRoot: {
    minWidth: "inherit",
    height: "20px",
    width: "20px",
    marginRight: "8px",
  },
}));

export function ShowPrivateKeyWarning() {
  const classes = useStyles();
  const background = useBackgroundClient();
  const nav = useNavStack();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const navButton = nav.navButtonRight;
    nav.setTitle("Show private key");
    return () => {
      nav.setNavButtonRight(navButton);
    };
  }, []);

  const _next = async () => {
    const activeWallet = await background.request({
      method: UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET,
      params: [],
    });
    let privateKey;
    try {
      privateKey = await background.request({
        method: UI_RPC_METHOD_KEYRING_EXPORT_SECRET_KEY,
        params: [password, activeWallet],
      });
    } catch (e) {
      console.error(e);
      setError(true);
      return;
    }
    nav.push("show-private-key", { privateKey });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ margin: "32px 24px 0 24px" }}>
        <HeaderIcon
          style={{ width: "40px", height: "40px", marginBottom: "24px" }}
          icon={<WarningIcon fill="#E95050" width="40px" height="40px" />}
        />
        <Header text="Warning" style={{ textAlign: "center" }} />
        <Box sx={{ marginTop: "24px" }}>
          <List className={classes.listRoot}>
            <ListItem className={classes.listItemRoot}>
              <ListItemIcon className={classes.listItemIconRoot}>
                <ChatIcon
                  htmlColor="#EF4444"
                  style={{
                    height: "20px",
                    width: "20px",
                  }}
                />
              </ListItemIcon>
              Backpack support will never ask for your private key.
            </ListItem>
            <ListItem className={classes.listItemRoot}>
              <ListItemIcon className={classes.listItemIconRoot}>
                <WebIcon
                  htmlColor="#EF4444"
                  style={{
                    height: "20px",
                    width: "20px",
                  }}
                />
              </ListItemIcon>
              Never share your private key or enter it into an app or website.
            </ListItem>
            <ListItem
              className={classes.listItemRoot}
              style={{ borderBottom: "none" }}
            >
              <ListItemIcon className={classes.listItemIconRoot}>
                <LockOpenIcon
                  htmlColor="#EF4444"
                  style={{ height: "20px", width: "20px" }}
                />
              </ListItemIcon>
              Anyone with your private key will have complete control of your
              account.
            </ListItem>
          </List>
        </Box>
      </Box>
      <Box
        sx={{
          marginLeft: "16px",
          marginRight: "16px",
          marginBottom: "16px",
        }}
      >
        <Box sx={{ marginBottom: "8px" }}>
          <TextField
            autoFocus={true}
            isError={error}
            inputProps={{ name: "password" }}
            placeholder="Password"
            type="password"
            value={password}
            setValue={setPassword}
            rootClass={classes.passwordField}
          />
        </Box>
        <DangerButton
          label="Show private key"
          onClick={_next}
          disabled={password.length === 0}
        />
      </Box>
    </Box>
  );
}

export function ShowPrivateKey({ privateKey }: { privateKey: string }) {
  const classes = useStyles();
  const { close } = useDrawerContext();
  const nav = useNavStack();

  useEffect(() => {
    nav.setTitle("Private key");
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box sx={{ margin: "32px 24px 0 24px" }}>
          <HeaderIcon
            icon={<EyeIcon />}
            style={{ width: "40px", height: "40px", marginBottom: "24px" }}
          />
          <Header text="Private key" style={{ textAlign: "center" }} />
          <SubtextParagraph style={{ textAlign: "center", fontSize: "14px" }}>
            Never give out your private key
          </SubtextParagraph>
        </Box>
        <Box sx={{ margin: "0 16px" }}>
          <TextField
            rows={3}
            readOnly={true}
            value={privateKey}
            rootClass={classes.privateKeyField}
          />
          <Box sx={{ marginTop: "4px" }}>
            <CopyButton text={privateKey} icon={<ContentCopyIcon />} />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          marginLeft: "16px",
          marginRight: "16px",
          marginBottom: "16px",
        }}
      >
        <SecondaryButton label="Close" onClick={() => close()} />
      </Box>
    </Box>
  );
}
